import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Sun, Moon, LogOut, User, Bell, Search, Settings } from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

import { useSidebar } from "@/contexts/SidebarContext";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, userProfile, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const profile = userProfile;
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  // جلوگیری از خطا در نبود profile
  const displayName = profile ? `${profile.firstName || "کاربر"} ${profile.lastName || "سیستم"}` : "کاربر سیستم";
  const initials = profile ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}` : "کا";

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-background/95 backdrop-blur-sm z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="منو"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold md:hidden">
          داشبورد
        </h1>
        
        <div className="hidden md:flex items-center relative max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="جستجو..." 
            className="pr-10 w-[300px] focus:w-[350px] transition-all border-muted bg-muted/50"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {showSearch && (
          <div className="absolute top-16 left-0 right-0 p-2 bg-background border-b md:hidden z-20">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="جستجو..." 
                className="pr-10 w-full"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="اعلان‌ها"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 left-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => {
          document.documentElement.classList.toggle('dark');
        }}>
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
        </Button>          <DropdownMenu>
             <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="status-indicator absolute -top-1 -left-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                </Button>
              
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{profile?.email || ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              <User className="ml-2 h-4 w-4" />
              <span>پروفایل</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="ml-2 h-4 w-4" />
              <span>تنظیمات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="ml-2 h-4 w-4" />
              <span>خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
