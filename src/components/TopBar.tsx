import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Plus, Grid3X3, List, LogOut } from "lucide-react";

interface TopBarProps {
  onToggleSidebar: () => void;
  onNewTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onLogout?: () => void;
  userName?: string;
}

export function TopBar({ 
  onToggleSidebar, 
  onNewTask, 
  searchQuery, 
  onSearchChange,
  viewMode,
  onViewModeChange,
  onLogout,
  userName 
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="lg:hidden mr-4"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My TO-DO List</h1>
            {userName && (
              <p className="text-sm text-slate-600">Welcome back, {userName}! Let's get things done.</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-sm"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'grid' ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Add Task Button */}
          <Button onClick={onNewTask} className="bg-primary hover:bg-primary-600">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          
          {/* Logout Button */}
          {onLogout && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLogout}
              className="text-slate-600 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
