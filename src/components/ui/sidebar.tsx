import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  Home, 
  Ticket, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  BarChart2, 
  Bell, 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCollapseChange: (collapsed: boolean) => void;
  user: {
    first_name?: string;
    last_name?: string;
    role_id?: string;
    avatar_url?: string;
  };
}

export function Sidebar({ open, onOpenChange, onCollapseChange, user }: SidebarProps) {  
  const router = useRouter();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // When collapsing, ensure the sidebar stays open
  useEffect(() => {
    if (collapsed) {
      onOpenChange(true);
    }
    onCollapseChange(collapsed);
  }, [collapsed, onOpenChange, onCollapseChange]);

  const menuItems = [
    {
      title: 'داشبورد',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard',
      access: ['all']
    },
    {
      title: 'تیکت‌ها',
      icon: <Ticket className="h-5 w-5" />,
      path: '/tickets',
      access: ['all']
    },
    {
      title: 'کاربران',
      icon: <Users className="h-5 w-5" />,
      path: '/users',
      access: ['admin', 'ceo', 'deputy']
    },
    {
      title: 'گفتگو',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/chat',
      access: ['all']
    },
    {
      title: 'گزارش‌ها',
      icon: <BarChart2 className="h-5 w-5" />,
      path: '/reports',
      access: ['admin', 'department_manager', 'branch_manager', 'ceo', 'deputy']
    },
    {
      title: 'پایگاه دانش',
      icon: <FileText className="h-5 w-5" />,
      path: '/knowledge-base',
      access: ['all']
    },
    {
      title: 'اعلان‌ها',
      icon: <Bell className="h-5 w-5" />,
      path: '/notifications',
      access: ['all']
    },
    {
      title: 'تاریخچه',
      icon: <Clock className="h-5 w-5" />,
      path: '/history',
      access: ['all']
    },
    {
      title: 'تنظیمات',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings',
      access: ['admin', 'ceo', 'deputy']
    },
    {
      title: 'راهنما',
      icon: <HelpCircle className="h-5 w-5" />,
      path: '/help',
      access: ['all']
    }
  ];

  const hasAccess = (access: string[]) => {
    if (access.includes('all')) return true;
    if (!user?.role_id) return false;
    return access.includes(user.role_id);
  };

  // Filter menu items based on user access
  const filteredMenuItems = menuItems.filter(item => hasAccess(item.access));
  
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'کاربر سیستم';
  
  // Render a menu item with proper active states
  const renderMenuItem = (item: any) => {
    const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
    
    return (
      <Tooltip key={item.path} delayDuration={300}>
            <TooltipTrigger asChild>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm mb-1 transition-colors relative group",
                    isActive
                      ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-full"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center mr-3">
                    {item.icon}
                  </span>
                  <span className={cn("flex-1 transition-opacity", collapsed ? "w-0 opacity-0" : "opacity-100")}>
                    {item.title}
                  </span>
                  <span className="badge-container">
                  {item.badge && !collapsed && (
                    <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link></TooltipTrigger>
              {collapsed && (
              <TooltipContent side="right">
                {item.title}
              </TooltipContent>
            )}
          </Tooltip>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div 
      className={cn(
        "h-screen fixed right-0 top-0 z-40 bg-background border-l flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          <div className="relative h-8 w-8 mr-2">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              fill 
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <h1 className="text-lg font-bold">تیکت یار</h1>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-muted-foreground hover:text-foreground", collapsed ? "mr-0" : "")}
        >
          {collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>      </div>
      
      <div className={cn(
        "flex items-center px-4 py-4 border-b",
        collapsed ? "flex-col" : ""
      )}>
        {collapsed ? (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Avatar className={cn("h-10 w-10", collapsed ? "mb-2" : "mr-3")}>
                <AvatarFallback>
                  {user.first_name?.[0] || user.last_name?.[0] ?
                    `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` :
                    'کاربر'}
                </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
            <TooltipContent side="right">
              {fullName}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Avatar className={cn("h-10 w-10", collapsed ? "mb-2" : "mr-3")}>
              <AvatarFallback>
              {user.first_name?.[0] || user.last_name?.[0] ?
                `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` :
                'کاربر'}
            </AvatarFallback>
          </Avatar>
        )}
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {getRoleName(user.role_id)}
            </p>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col">
          {menuItems.map(item => 
            // Only render items that the user has access to
            (item.access.includes('all') || item.access.includes(user.role_id || '')) && 
            renderMenuItem(item)
          )}
        </nav>
      </ScrollArea>
        <div className="p-3 mt-auto border-t">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center w-full py-2 px-3 text-sm rounded-md hover:bg-muted text-destructive hover:text-destructive",
                collapsed ? "justify-center" : ""
              )}              onClick={async () => {
                await signOut();
                router.push('/auth/login');
              }}
            >
              <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              <span className={cn(collapsed ? "sr-only" : "")}>خروج</span>
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              خروج
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
  
  // Helper to convert role IDs to readable names
  function getRoleName(roleId?: string) {
    switch (roleId) {
      case 'admin': return 'مدیر سیستم';
      case 'ceo': return 'مدیرعامل';
      case 'deputy': return 'معاون';
      case 'department_manager': return 'مدیر بخش';
      case 'branch_manager': return 'مدیر شعبه';
      case 'user': return 'کاربر';
      default: return 'کاربر';
    }
  }
}
