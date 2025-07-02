import { useQuery } from '@tanstack/react-query';
import { TaskList } from '@/components/TaskList';
import { useAuth } from '@/hooks/useAuth';

export default function SharedTasks() {
  const { user, isLoading } = useAuth();
  const { data, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks/shared'],
    enabled: !!user,
  });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shared Tasks</h1>
      <TaskList tasks={data || []} isLoading={isLoading || tasksLoading} />
    </div>
  );
} 