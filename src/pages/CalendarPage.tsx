import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { format, isSameDay, parseISO, isSameMonth } from "date-fns";

function getTaskDates(tasks: any[]) {
  // Return a map of date string (yyyy-mm-dd) to array of tasks
  const map: Record<string, any[]> = {};
  tasks.forEach(task => {
    if (task.dueDate) {
      const dateStr = format(parseISO(task.dueDate), 'yyyy-MM-dd');
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(task);
    }
  });
  return map;
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export default function CalendarPage() {
  const { data: tasksData, isLoading } = useQuery<{ tasks: any[] }>({
    queryKey: ['/api/tasks'],
  });
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const tasks = tasksData?.tasks || [];
  const taskDates = getTaskDates(tasks);
  const tasksForSelected = selected
    ? tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), selected))
    : [];
  const monthReference = selected || new Date();
  const monthTasks = tasks.filter(task => task.dueDate && isSameMonth(parseISO(task.dueDate), monthReference));

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 drop-shadow">Calendar</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="p-6 shadow-xl w-full md:w-auto">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{
                hasTask: Object.keys(taskDates).map(dateStr => parseISO(dateStr)),
              }}
              modifiersClassNames={{
                hasTask: 'relative bg-blue-100 border-blue-400 border-2',
              }}
              renderDay={(date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const dayTasks = taskDates[dateStr] || [];
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{date.getDate()}</span>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((task, idx) => (
                        <span key={idx} className={`w-2 h-2 rounded-full ${priorityColors[task.priority] || 'bg-blue-500'}`} />
                      ))}
                      {dayTasks.length > 3 && <span className="w-2 h-2 rounded-full bg-gray-400">+</span>}
                    </div>
                  </div>
                );
              }}
            />
            <div className="mt-4 text-sm text-gray-600 text-center">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" /> High
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mx-2" /> Medium
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mx-2" /> Low
            </div>
          </Card>
          <div className="flex-1">
            <Card className="p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">{selected ? `Tasks for ${format(selected, 'PPP')}` : 'Select a date'}</h2>
              {selected && tasksForSelected.length === 0 && <div className="text-gray-500">No tasks due this day.</div>}
              {selected && tasksForSelected.length > 0 && (
                <div className="space-y-2">
                  {tasksForSelected.map(task => (
                    <Card key={task._id} className="p-4 flex flex-col gap-1 border-l-4 shadow-md"
                      style={{ borderColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e42' : '#22c55e' }}>
                      <div className="font-semibold text-blue-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                      <div className="text-xs text-gray-400">Due: {format(parseISO(task.dueDate), 'PPP')}</div>
                    </Card>
                  ))}
                </div>
              )}
              {!selected && (
                <div className="text-gray-500">Select a date to see tasks.</div>
              )}
            </Card>
            <Card className="p-4 mt-6 shadow">
              <h3 className="text-md font-semibold mb-2 text-purple-700">This Month's Tasks</h3>
              {monthTasks.length === 0 && <div className="text-gray-400">No tasks for this month.</div>}
              {monthTasks.length > 0 && (
                <ul className="space-y-1">
                  {monthTasks.map(task => (
                    <li key={task._id} className="flex items-center gap-2 text-sm">
                      <span className={`inline-block w-2 h-2 rounded-full ${priorityColors[task.priority] || 'bg-blue-500'}`} />
                      <span className="font-medium text-blue-900">{task.title}</span>
                      <span className="text-xs text-gray-500">({format(parseISO(task.dueDate), 'MMM d')})</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 