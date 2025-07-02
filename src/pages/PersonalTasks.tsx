import { useQuery } from '@tanstack/react-query';
import { TaskList } from '@/components/TaskList';
import { useAuth } from '@/hooks/useAuth';

export default function PersonalTasks() {
  const { user, isLoading } = useAuth();
  const { data, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks', { category: 'personal' }],
    enabled: !!user,
  });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Personal Tasks</h1>
      <TaskList tasks={data?.tasks || []} isLoading={isLoading || tasksLoading} />
    </div>
  );
} 