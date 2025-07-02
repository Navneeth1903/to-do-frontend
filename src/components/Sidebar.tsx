import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Home, List, Users, Calendar, CheckSquare, Folder, User, Briefcase, Users as TeamIcon, MoreVertical } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: List, label: "Stats/Review", to: "/stats" },
    { icon: CheckSquare, label: "My TO-DO", to: "/" },
  ];

  const projectItems = [
    { icon: List, label: "All Tasks", to: "/all-tasks" },
    { icon: Users, label: "Shared Tasks", to: "/shared-tasks" },
    { icon: Calendar, label: "Calendar", to: "/calendar" },
    { icon: Folder, label: "Projects", to: "/projects" },
    { icon: Briefcase, label: "Work Tasks", to: "/work-tasks" },
    { icon: User, label: "Personal", to: "/personal-tasks" },
    { icon: TeamIcon, label: "Team Project", to: "/team-project-tasks" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">TaskFlow</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="lg:hidden"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        <nav className="mt-6 px-3">
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</h3>
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className={`flex items-center px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors ${location.pathname === item.to ? 'bg-slate-200 font-semibold' : ''}`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Projects</h3>
            <ul className="space-y-1">
              {projectItems.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className={`flex items-center px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors ${location.pathname === item.to ? 'bg-slate-200 font-semibold' : ''}`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-3">
              <AvatarImage src={user?.profileImageUrl || ''} />
              <AvatarFallback>
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
