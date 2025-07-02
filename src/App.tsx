import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";
import AllTasks from './pages/AllTasks';
import SharedTasks from './pages/SharedTasks';
import CalendarPage from './pages/CalendarPage';
import ProjectsPage from './pages/ProjectsPage';
import WorkTasks from './pages/WorkTasks';
import PersonalTasks from './pages/PersonalTasks';
import TeamProjectTasks from './pages/TeamProjectTasks';
import StatsReview from './pages/StatsReview';

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('Router - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading); // Debug log

  // Show loading during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Simple routing - show Auth if not authenticated, Dashboard if authenticated
  if (!isAuthenticated) {
    console.log('Showing Auth page'); // Debug log
    return <Auth />;
  }

  console.log('Showing Dashboard'); // Debug log
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-tasks" element={<AllTasks />} />
        <Route path="/shared-tasks" element={<SharedTasks />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/work-tasks" element={<WorkTasks />} />
        <Route path="/personal-tasks" element={<PersonalTasks />} />
        <Route path="/team-project-tasks" element={<TeamProjectTasks />} />
        <Route path="/stats" element={<StatsReview />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  console.log('App component rendering'); // Debug log
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
