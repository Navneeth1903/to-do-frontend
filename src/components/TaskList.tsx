import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, Edit, Trash2, Clock, ListTodo } from 'lucide-react';
import { format, isToday, isFuture } from 'date-fns';

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
};
const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-gray-100 text-gray-700',
};

export function TaskList({
  tasks = [],
  total = 0,
  currentPage = 1,
  pageSize = 10,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  tasks: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (task: any) => void;
  onDelete?: (task: any) => void;
  onToggleComplete?: (task: any) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading your tasks...</div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold text-gray-700">
          Total Tasks: {total}
        </span>
      </div>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ListTodo className="w-16 h-16 text-blue-200 mb-4" />
          <div className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</div>
          <div className="text-gray-400 mb-4">Start by adding your first task!</div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: any) => (
            <Card key={task._id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4 shadow-md border-l-8 transition-all duration-300 ${
              task.priority === 'high' ? 'border-red-400' : task.priority === 'medium' ? 'border-orange-400' : 'border-green-400'
            } bg-white/90 hover:bg-blue-50/60 hover:shadow-xl rounded-2xl animate-fade-in`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.status === 'completed'} onChange={() => onToggleComplete && onToggleComplete(task)} className="w-5 h-5 accent-green-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg truncate">{task.title}</span>
                    {task.status && (
                      <Badge className={`ml-2 ${statusColors[task.status] || 'bg-gray-100 text-gray-700'}`}>{task.status.replace('-', ' ')}</Badge>
                    )}
                    {task.priority && (
                      <Badge className={`ml-2 ${priorityColors[task.priority] || 'bg-gray-100 text-gray-700'}`}>{task.priority}</Badge>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm truncate max-w-xl">{task.description}</div>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-4 h-4" />
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>
                  )}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-2 ml-2">
                      <div className="font-semibold text-xs text-blue-500 mb-1">Checklist</div>
                      <ul className="list-disc ml-4">
                        {task.subtasks.map((sub: any, idx: number) => (
                          <li key={idx} className={sub.completed ? 'line-through text-gray-400' : ''}>{sub.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button size="icon" variant="ghost" onClick={() => onEdit && onEdit(task)} title="Edit">
                  <Edit className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete && onDelete(task)} title="Delete">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
          {total > pageSize && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(total / pageSize) }).map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={i + 1 === currentPage ? 'default' : 'outline'}
                  className="mx-1"
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
