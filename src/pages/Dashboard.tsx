import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { StatsCards } from "@/components/StatsCards";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskList } from "@/components/TaskList";
import { TaskModal } from "@/components/TaskModal";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { User } from "../lib/schema";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  const [taskView, setTaskView] = useState<'all' | 'my'>('my');
  const taskListRef = useRef<HTMLDivElement>(null);
  const [isTaskModalLoading, setIsTaskModalLoading] = useState(false);

  const { user, isLoading: authLoading, logout } = useAuth() as { user: User | undefined, isLoading: boolean, logout: () => void };
  const { isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  console.log('Dashboard - user:', user, 'authLoading:', authLoading); // Debug log

  // Handle unauthorized errors
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('Dashboard - No user found, redirecting to login'); // Debug log
      toast.error("You are not logged in. Please log in.", { duration: 2000 });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [user, authLoading]);

  const { data: tasksData, isLoading: tasksLoading, error, refetch } = useQuery<{ tasks: any[]; total: number }, Error>({
    queryKey: ['/api/tasks', { 
      ...filters, 
      search: searchQuery, 
      page: currentPage, 
      limit: 10,
      createdBy: taskView === 'my' ? user?.id : undefined,
    }],
    enabled: !!user,
    retry: false,
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      console.error('Dashboard - Query error:', error); // Debug log
      toast.error("Failed to load tasks. Please try again.", { duration: 2000 });
    }
  }, [error]);

  // Create or update a task
  const handleSaveTask = async (task: any) => {
    setIsTaskModalLoading(true);
    try {
      // Ensure dueDate is a Date object if present
      if (task.dueDate && typeof task.dueDate === 'string') {
        task.dueDate = new Date(task.dueDate);
      }
      // Convert shareWith to array if it's a string
      if (typeof task.shareWith === 'string') {
        const arr = task.shareWith.split(',').map((email: string) => email.trim()).filter(Boolean);
        if (arr.length > 0) {
          task.shareWith = arr;
        } else {
          delete task.shareWith;
        }
      }
      const isEdit = !!task._id;
      const url = isEdit ? `/api/tasks/${task._id}` : '/api/tasks';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(task),
      });
      if (!res.ok) {
        let errorMsg = 'Failed to save task';
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
          console.error('Task save error:', data);
        } catch (e) {
          console.error('Task save error (non-JSON):', res.statusText);
        }
        toast.error(errorMsg);
        setIsTaskModalLoading(false);
        return;
      }
      toast.success(isEdit ? 'Task updated!' : 'Task created!');
      setIsTaskModalOpen(false);
      setEditingTask(null);
      setFilters({
        status: 'all',
        priority: 'all',
        category: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setTaskView('my');
      setCurrentPage(1);
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setTimeout(() => refetch(), 200);
      setTimeout(() => {
        console.log('After creation, tasksData:', tasksData);
      }, 500);
      setTimeout(() => {
        if (taskListRef.current) {
          taskListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } catch (err: any) {
      console.error('Task save error (exception):', err);
      toast.error(err.message || 'Failed to save task');
    } finally {
      setIsTaskModalLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (task: any) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '',
        },
      });
      if (!res.ok) {
        let errorMsg = 'Failed to delete task';
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
          console.error('Task delete error:', data);
        } catch (e) {
          console.error('Task delete error (non-JSON):', res.statusText);
        }
        toast.error(errorMsg);
        return;
      }
      toast.success('Task deleted!');
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (err: any) {
      console.error('Task delete error (exception):', err);
      toast.error(err.message || 'Failed to delete task');
    }
  };

  // Mark as completed (with optimistic UI)
  const handleToggleComplete = async (task: any) => {
    // Ensure dueDate is a Date object if present
    if (task.dueDate && typeof task.dueDate === 'string') {
      task.dueDate = new Date(task.dueDate);
    }
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
    queryClient.setQueryData(['/api/tasks', { ...filters, search: searchQuery, page: currentPage, limit: 10, createdBy: taskView === 'my' ? user?.id : undefined }], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        tasks: old.tasks.map((t: any) => t._id === task._id ? { ...t, status: updatedStatus } : t)
      };
    });
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({ ...task, status: updatedStatus }),
      });
      if (!res.ok) {
        let errorMsg = 'Failed to update task';
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
          console.error('Task update error:', data);
        } catch (e) {
          console.error('Task update error (non-JSON):', res.statusText);
        }
        toast.error(errorMsg);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (err: any) {
      console.error('Task update error (exception):', err);
      toast.error(err.message || 'Failed to update task');
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  console.log('Dashboard - Rendering with user:', user); // Debug log
  console.log('Dashboard - tasksData:', tasksData);
  console.log('Dashboard - passing tasks to TaskList:', tasksData?.tasks);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-slate-700">Loading...</span>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard - No user, showing loading'); // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-slate-700">Redirecting to login...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-200">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onNewTask={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onLogout={logout}
          userName={user?.name}
        />
        <main className="p-4 sm:p-8 lg:p-12 bg-white/60 rounded-3xl shadow-2xl mt-6 mx-2 lg:mx-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-6 drop-shadow-lg">My TO-DO List</h1>
          <StatsCards className="mb-8" animated />
          <div className="mb-4 flex gap-2">
            <Button
              variant={taskView === 'my' ? 'default' : 'outline'}
              className={`rounded-full px-6 py-2 text-lg font-semibold shadow-md ${taskView === 'my' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white text-blue-600 border-blue-300'}`}
              onClick={() => setTaskView('my')}
            >
              My TO-DO
            </Button>
            <Button
              variant={taskView === 'all' ? 'default' : 'outline'}
              className={`rounded-full px-6 py-2 text-lg font-semibold shadow-md ${taskView === 'all' ? 'bg-gradient-to-r from-pink-500 to-teal-400 text-white' : 'bg-white text-pink-600 border-pink-300'}`}
              onClick={() => setTaskView('all')}
            >
              All Tasks
            </Button>
          </div>
          <div className="mb-6">
            <TaskFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
          <div ref={taskListRef} />
          <div className="rounded-2xl bg-white/80 shadow-xl p-6">
            <TaskList
              tasks={tasksData?.tasks || []}
              total={tasksData?.total || 0}
              currentPage={currentPage}
              pageSize={10}
              isLoading={tasksLoading}
              onPageChange={setCurrentPage}
              onEdit={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </main>
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTask}
        isLoading={isTaskModalLoading}
      />
      {/* Connection status indicator */}
      {!isConnected && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm">
          Reconnecting to server...
        </div>
      )}
    </div>
  );
}
