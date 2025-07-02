import { TaskWithDetails } from "../lib/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, Share2, Edit, Trash2, Circle, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

interface TaskCardProps {
  task: TaskWithDetails;
  onEdit: (task: TaskWithDetails) => void;
  onShare: (task: TaskWithDetails) => void;
}

export function TaskCard({ task, onEdit, onShare }: TaskCardProps) {
  const queryClient = useQueryClient();

  const toggleComplete = useMutation({
    mutationFn: async () => {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast.success('Task status updated');
    },
    onError: () => {
      toast.error('Failed to update task status');
    }
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      await fetch(`/api/tasks/${task._id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    }
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComplete.mutate()}
            className="mt-1 p-0 h-auto text-slate-400 hover:text-green-600"
            disabled={toggleComplete.isPending}
          >
            {task.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold text-slate-900 mb-2 ${
              task.status === 'completed' ? 'line-through opacity-75' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-slate-600 text-sm mb-3 ${
                task.status === 'completed' ? 'opacity-75' : ''
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status === 'in-progress' ? 'In Progress' : 
                 task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              {task.dueDate && (
                <span className={`text-slate-500 flex items-center ${isOverdue ? 'text-red-500' : ''}`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  {task.status === 'completed' ? 'Completed: ' : 'Due: '}
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </span>
              )}
              <span className="text-slate-500 flex items-center">
                <User className="h-4 w-4 mr-1" />
                {task.creator.firstName || task.creator.email}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(task)}
            className="p-2 text-slate-400 hover:text-blue-600"
            title="Share Task"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-slate-600"
            title="Edit Task"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600"
            title="Delete Task"
            disabled={deleteTask.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {task.isShared && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500">
            <div className="flex -space-x-1 mr-2">
              {task.collaborators.slice(0, 3).map((collab, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-white">
                  <AvatarImage src={collab.user.profileImageUrl || ''} />
                  <AvatarFallback className="text-xs">
                    {collab.user.firstName?.charAt(0) || collab.user.email?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            Shared with {task.collaboratorCount} {task.collaboratorCount === 1 ? 'person' : 'people'}
          </div>
          <div className="text-xs text-slate-500">
            Updated {format(new Date(task.updatedAt || task.createdAt), 'MMM dd, HH:mm')}
          </div>
        </div>
      )}
    </div>
  );
}
