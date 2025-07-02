import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import { format, isToday, isThisWeek, isFuture, isPast } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsReview() {
  const { data } = useQuery({ queryKey: ['/api/tasks'] });
  const tasks = data?.tasks || [];
  const completed = tasks.filter((t: any) => t.status === 'completed');
  const today = tasks.filter((t: any) => t.dueDate && isToday(new Date(t.dueDate)));
  const week = tasks.filter((t: any) => t.dueDate && isThisWeek(new Date(t.dueDate)));
  const overdue = tasks.filter((t: any) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'completed');
  const upcoming = tasks.filter((t: any) => t.dueDate && isFuture(new Date(t.dueDate)) && t.status !== 'completed');

  const percent = (n: number, d: number) => d === 0 ? 0 : Math.round((n / d) * 100);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gradient bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Stats & Review</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="font-bold mb-2">Today's Progress</div>
          <Progress value={percent(completed.filter((t: any) => isToday(new Date(t.dueDate))).length, today.length)} />
          <div className="text-sm mt-2">{completed.filter((t: any) => isToday(new Date(t.dueDate))).length} of {today.length} tasks completed</div>
        </Card>
        <Card className="p-6">
          <div className="font-bold mb-2">This Week</div>
          <Progress value={percent(completed.filter((t: any) => isThisWeek(new Date(t.dueDate))).length, week.length)} />
          <div className="text-sm mt-2">{completed.filter((t: any) => isThisWeek(new Date(t.dueDate))).length} of {week.length} tasks completed</div>
        </Card>
        <Card className="p-6">
          <div className="font-bold mb-2">Overall</div>
          <Progress value={percent(completed.length, tasks.length)} />
          <div className="text-sm mt-2">{completed.length} of {tasks.length} tasks completed</div>
        </Card>
      </div>
      <div className="bg-white/80 rounded-2xl shadow-xl p-6 mb-8">
        <div className="font-bold mb-4">Productivity Chart</div>
        {/* Simple bar chart for completed vs. pending */}
        <Bar
          data={{
            labels: ['Completed', 'Pending'],
            datasets: [{
              label: 'Tasks',
              data: [completed.length, tasks.length - completed.length],
              backgroundColor: ['#22c55e', '#f59e42'],
            }],
          }}
          options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
            responsive: true,
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="font-bold mb-2 text-green-600">Completed Tasks</div>
          <ul className="max-h-48 overflow-y-auto">
            {completed.slice(0, 10).map((t: any) => (
              <li key={t._id} className="truncate text-sm">{t.title} <span className="text-xs text-gray-400">({t.dueDate ? format(new Date(t.dueDate), 'MMM d') : 'No date'})</span></li>
            ))}
            {completed.length === 0 && <li className="text-gray-400">No completed tasks</li>}
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-bold mb-2 text-red-600">Overdue Tasks</div>
          <ul className="max-h-48 overflow-y-auto">
            {overdue.slice(0, 10).map((t: any) => (
              <li key={t._id} className="truncate text-sm">{t.title} <span className="text-xs text-gray-400">({t.dueDate ? format(new Date(t.dueDate), 'MMM d') : 'No date'})</span></li>
            ))}
            {overdue.length === 0 && <li className="text-gray-400">No overdue tasks</li>}
          </ul>
        </Card>
        <Card className="p-4">
          <div className="font-bold mb-2 text-blue-600">Upcoming Tasks</div>
          <ul className="max-h-48 overflow-y-auto">
            {upcoming.slice(0, 10).map((t: any) => (
              <li key={t._id} className="truncate text-sm">{t.title} <span className="text-xs text-gray-400">({t.dueDate ? format(new Date(t.dueDate), 'MMM d') : 'No date'})</span></li>
            ))}
            {upcoming.length === 0 && <li className="text-gray-400">No upcoming tasks</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
} 