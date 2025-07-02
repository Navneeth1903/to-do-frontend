import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only connect if we're on the dashboard (authenticated)
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    if (!isAuthenticated) {
      console.log('WebSocket: Not authenticated, skipping connection');
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // Use environment variable or fallback to localhost for development
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const wsUrl = `${protocol}//${apiBase.replace(/^https?:\/\//, '')}/api/ws`;
    
    console.log('WebSocket: Attempting to connect to:', wsUrl);
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected successfully');
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', event.code, event.reason);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  }, []);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'task_created':
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        toast.success('New task created');
        break;
        
      case 'task_updated':
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/tasks', message.data.task.id] });
        toast.info('Task updated');
        break;
        
      case 'task_deleted':
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        toast.info('Task deleted');
        break;
        
      case 'task_shared':
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        toast.success('Task shared with you');
        break;
        
      case 'task_unshared':
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        toast.info('Task access removed');
        break;
        
      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  };

  return { isConnected };
}
