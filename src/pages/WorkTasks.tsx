import { useQuery } from '@tanstack/react-query';
import { TaskList } from '@/components/TaskList';
import { useAuth } from '@/hooks/useAuth';

export default function WorkTasks() {
  const { user, isLoading } = useAuth();
  const { data, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks', { category: 'work' }],
    enabled: !!user,
  });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Work Tasks</h1>
      <TaskList tasks={data?.tasks || []} isLoading={isLoading || tasksLoading} />
    </div>
  );
} 