import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, Clock, AlertTriangle, ListTodo, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function StatsCards() {
  const { data: stats, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const statItems = [
    {
      label: "Total Tasks",
      value: stats?.total || 0,
      icon: ListTodo,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Completed",
      value: stats?.completed || 0,
      icon: CheckSquare,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "In Progress",
      value: stats?.inProgress || 0,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Overdue",
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-slate-200 rounded-lg w-10 h-10" />
                <div className="ml-4 space-y-2">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-6 w-12 bg-slate-200 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-end mb-2">
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
