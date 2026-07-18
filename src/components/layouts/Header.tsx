import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  Bell,
  Search,
  Settings,
  PlusCircle,
  Ticket,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick: () => void;
}

type Notif = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { userProfile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const profile = userProfile;
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const isMobile = useIsMobile();

  const displayName = profile
    ? `${profile.firstName || "کاربر"} ${profile.lastName || ""}`.trim()
    : "کاربر سیستم";
  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}` || "کا"
    : "کا";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/notifications", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setNotifications(data.notifications || []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/tickets?search=${encodeURIComponent(q)}`);
    setShowSearch(false);
  };

  const pageTitle =
    router.pathname.startsWith("/tickets")
      ? "تیکت‌ها"
      : router.pathname.startsWith("/admin")
        ? "مدیریت"
        : router.pathname.startsWith("/settings")
          ? "تنظیمات"
          : router.pathname.startsWith("/knowledge")
            ? "پایگاه دانش"
            : router.pathname.startsWith("/reports")
              ? "گزارش‌ها"
              : router.pathname.startsWith("/users")
                ? "کاربران"
                : router.pathname.startsWith("/notifications")
                  ? "اعلان‌ها"
                  : router.pathname.startsWith("/chat")
                    ? "گفتگو"
                    : router.pathname.startsWith("/help")
                      ? "راهنما"
                      : router.pathname.startsWith("/history")
                        ? "تاریخچه"
                        : "داشبورد";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 shadow-sm backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl md:hidden"
          onClick={onMenuClick}
          aria-label="منو"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:block">
          <p className="text-xs text-muted-foreground">سامانه تیکت‌یار</p>
          <h1 className="text-base font-bold tracking-tight">{pageTitle}</h1>
        </div>

        <form onSubmit={submitSearch} className="relative hidden md:block">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی تیکت، کد پیگیری..."
            className="w-[280px] rounded-xl border-muted bg-muted/40 pr-10 transition-all focus:w-[340px] focus:bg-background lg:w-[320px]"
          />
        </form>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl md:hidden"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {showSearch && (
          <div className="absolute left-0 right-0 top-16 z-20 border-b bg-background p-3 md:hidden">
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو..."
                className="w-full rounded-xl pr-10"
                autoFocus
              />
            </form>
          </div>
        )}

        <Button
          size="sm"
          className="hidden gap-1.5 rounded-xl shadow-md shadow-primary/20 sm:inline-flex"
          onClick={() => router.push("/tickets/new")}
        >
          <PlusCircle className="h-4 w-4" />
          تیکت جدید
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute left-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
            <div className="flex items-center justify-between border-b px-3 py-2.5">
              <span className="text-sm font-semibold">اعلان‌ها</span>
              {unread > 0 && (
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {unread} خوانده‌نشده
                </Badge>
              )}
            </div>
            <div className="max-h-72 overflow-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  اعلانی وجود ندارد
                </p>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5"
                    onClick={() => router.push(n.link || "/notifications")}
                  >
                    <span className="text-sm leading-snug">{n.message}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString("fa-IR")}
                      {!n.isRead ? " · جدید" : ""}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary"
              onClick={() => router.push("/notifications")}
            >
              مشاهده همه
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={toggleTheme}
          aria-label="تغییر تم"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 rounded-full px-1.5">
              <Avatar className="h-9 w-9 ring-2 ring-primary/15">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-indigo-500/20 text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <span className="mr-2 hidden max-w-[100px] truncate text-sm font-medium lg:inline">
                  {displayName}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl" align="end">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs text-muted-foreground">{profile?.email || ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/tickets")}>
              <Ticket className="ml-2 h-4 w-4" />
              تیکت‌های من
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              <User className="ml-2 h-4 w-4" />
              پروفایل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="ml-2 h-4 w-4" />
              تنظیمات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="ml-2 h-4 w-4" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
