import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  Clock,
  PlusCircle,
  LayoutDashboard,
  Building2,
  Shield,
  UserPlus,
  BookOpen,
  Sparkles,
  ChevronDown,
  List,
  History,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

type MenuChild = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  access?: string[];
  badge?: string;
};

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  path?: string;
  access: string[];
  color: string;
  badge?: string;
  children?: MenuChild[];
};

const ROLE_LABELS: Record<string, string> = {
  admin: "مدیر سیستم",
  ceo: "مدیرعامل",
  deputy: "معاون",
  department_manager: "مدیر بخش",
  branch_manager: "مدیر شعبه",
  support: "کارشناس",
  user: "کاربر",
};

function canAccess(access: string[] | undefined, role?: string) {
  if (!access || access.includes("all")) return true;
  if (!role) return false;
  return access.includes(role);
}

export function Sidebar({ open, onOpenChange, onCollapseChange, user }: SidebarProps) {
  const router = useRouter();
  const { signOut, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    tickets: true,
    admin: true,
  });

  useEffect(() => {
    onCollapseChange(collapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        title: "داشبورد",
        icon: <Home className="h-4 w-4" />,
        path: "/dashboard",
        access: ["all"],
        color: "from-blue-500 to-indigo-600",
      },
      {
        title: "تیکت‌ها",
        icon: <Ticket className="h-4 w-4" />,
        access: ["all"],
        color: "from-violet-500 to-purple-600",
        children: [
          { title: "همه تیکت‌ها", path: "/tickets", icon: <List className="h-3.5 w-3.5" /> },
          {
            title: "تیکت جدید",
            path: "/tickets/new",
            icon: <PlusCircle className="h-3.5 w-3.5" />,
            badge: "جدید",
          },
          { title: "تاریخچه", path: "/history", icon: <History className="h-3.5 w-3.5" /> },
        ],
      },
      {
        title: "گفتگو",
        icon: <MessageSquare className="h-4 w-4" />,
        path: "/chat",
        access: ["all"],
        color: "from-emerald-500 to-teal-600",
      },
      {
        title: "پایگاه دانش",
        icon: <BookOpen className="h-4 w-4" />,
        access: ["all"],
        color: "from-amber-500 to-orange-600",
        children: [
          { title: "مقالات", path: "/knowledge-base", icon: <FileText className="h-3.5 w-3.5" /> },
          {
            title: "مقاله جدید",
            path: "/knowledge-base/new",
            icon: <PlusCircle className="h-3.5 w-3.5" />,
            access: ["admin", "department_manager", "support", "ceo", "deputy"],
          },
        ],
      },
      {
        title: "گزارش‌ها",
        icon: <BarChart2 className="h-4 w-4" />,
        path: "/reports",
        access: ["admin", "department_manager", "branch_manager", "ceo", "deputy", "support"],
        color: "from-cyan-500 to-sky-600",
      },
      {
        title: "اعلان‌ها",
        icon: <Bell className="h-4 w-4" />,
        path: "/notifications",
        access: ["all"],
        color: "from-rose-500 to-pink-600",
      },
      {
        title: "کاربران",
        icon: <Users className="h-4 w-4" />,
        access: ["admin", "ceo", "deputy", "department_manager"],
        color: "from-fuchsia-500 to-pink-600",
        children: [
          { title: "لیست کاربران", path: "/users", icon: <Users className="h-3.5 w-3.5" /> },
          {
            title: "ایجاد کاربر",
            path: "/admin/create-user",
            icon: <UserPlus className="h-3.5 w-3.5" />,
            access: ["admin"],
          },
          {
            title: "کارشناسان",
            path: "/users/expert",
            icon: <Wrench className="h-3.5 w-3.5" />,
          },
          {
            title: "مدیران",
            path: "/users/manager",
            icon: <Shield className="h-3.5 w-3.5" />,
          },
        ],
      },
      {
        title: "مدیریت",
        icon: <LayoutDashboard className="h-4 w-4" />,
        access: ["admin", "ceo", "deputy"],
        color: "from-slate-600 to-slate-800",
        children: [
          { title: "پنل ادمین", path: "/admin", icon: <Sparkles className="h-3.5 w-3.5" /> },
          {
            title: "دپارتمان‌ها",
            path: "/admin/departments",
            icon: <Building2 className="h-3.5 w-3.5" />,
          },
          { title: "شعب", path: "/admin/branches", icon: <Building2 className="h-3.5 w-3.5" /> },
          { title: "نقش‌ها", path: "/admin/roles", icon: <Shield className="h-3.5 w-3.5" /> },
          {
            title: "ثبت‌نام‌های معلق",
            path: "/admin/pending-registrations",
            icon: <Clock className="h-3.5 w-3.5" />,
          },
        ],
      },
      {
        title: "تنظیمات",
        icon: <Settings className="h-4 w-4" />,
        access: ["all"],
        color: "from-gray-500 to-zinc-700",
        children: [
          { title: "عمومی", path: "/settings", icon: <Settings className="h-3.5 w-3.5" /> },
          { title: "پروفایل", path: "/settings/profile", icon: <Users className="h-3.5 w-3.5" /> },
          { title: "امنیت", path: "/settings/security", icon: <Shield className="h-3.5 w-3.5" /> },
          {
            title: "اعلان‌ها",
            path: "/settings/notifications",
            icon: <Bell className="h-3.5 w-3.5" />,
          },
        ],
      },
      {
        title: "راهنما",
        icon: <HelpCircle className="h-4 w-4" />,
        path: "/help",
        access: ["all"],
        color: "from-lime-500 to-green-600",
      },
    ],
    []
  );

  const role = user?.role_id || "user";
  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "کاربر سیستم";
  const initials =
    `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}` || "کا";

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard") return router.pathname === "/dashboard";
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderLink = (
    item: { title: string; path: string; icon?: React.ReactNode; badge?: string },
    opts?: { nested?: boolean; color?: string }
  ) => {
    const active = isPathActive(item.path);
    const content = (
      <Link
        href={item.path}
        className={cn(
          "group flex items-center gap-2.5 rounded-xl text-sm transition-all duration-200",
          opts?.nested ? "py-2 px-3 mr-2" : "py-2.5 px-3",
          active
            ? "bg-primary/12 text-primary font-semibold shadow-sm shadow-primary/10"
            : "text-foreground/75 hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
            active
              ? `bg-gradient-to-br ${opts?.color || "from-primary to-indigo-600"} text-white shadow-md`
              : "bg-muted text-foreground/70"
          )}
        >
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                {item.badge}
              </span>
            )}
            {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} delayDuration={200}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="left">{item.title}</TooltipContent>
        </Tooltip>
      );
    }
    return <div key={item.path}>{content}</div>;
  };

  if (!open) return null;

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-40 flex h-screen flex-col border-l border-border/60 bg-gradient-to-b from-background via-background to-muted/20 shadow-xl shadow-black/5 transition-all duration-300",
        collapsed ? "w-[4.5rem]" : "w-72"
      )}
    >
      {/* Brand */}
      <div className="relative overflow-hidden border-b border-border/50 px-3 py-4">
        <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
        <div className="relative flex items-center justify-between gap-2">
          <div className={cn("flex items-center gap-2.5", collapsed && "w-full justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/30">
              <Ticket className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-base font-bold tracking-tight">تیکت‌یار</p>
                <p className="text-[11px] text-muted-foreground">سامانه سازمانی</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setCollapsed(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-2 h-8 w-full rounded-lg"
            onClick={() => setCollapsed(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* User card */}
      <div className={cn("border-b border-border/50 p-3", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl bg-muted/50 p-2.5 ring-1 ring-border/40",
            collapsed && "flex-col p-2"
          )}
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-indigo-500/20 text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{fullName}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {ROLE_LABELS[role] || "کاربر"}
                {isAdmin ? " · دسترسی کامل" : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {menuItems
            .filter((item) => canAccess(item.access, role))
            .map((item) => {
              if (item.children?.length) {
                const groupKey = item.title;
                const kids = item.children.filter((c) =>
                  canAccess(c.access || item.access, role)
                );
                if (!kids.length) return null;
                const groupOpen = openGroups[groupKey] ?? true;
                const childActive = kids.some((c) => isPathActive(c.path));

                if (collapsed) {
                  return (
                    <div key={groupKey} className="space-y-1">
                      {kids.map((c) =>
                        renderLink(
                          {
                            title: c.title,
                            path: c.path,
                            icon: c.icon || item.icon,
                            badge: c.badge,
                          },
                          { color: item.color }
                        )
                      )}
                    </div>
                  );
                }

                return (
                  <div key={groupKey} className="mb-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupKey)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all",
                        childActive
                          ? "text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted/70"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md",
                          item.color
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 text-right">{item.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          groupOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {groupOpen && (
                      <div className="mt-1 space-y-0.5 border-r-2 border-primary/15 pr-1 mr-5">
                        {kids.map((c) =>
                          renderLink(
                            {
                              title: c.title,
                              path: c.path,
                              icon: c.icon,
                              badge: c.badge,
                            },
                            { nested: true, color: item.color }
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return renderLink(
                {
                  title: item.title,
                  path: item.path!,
                  icon: item.icon,
                  badge: item.badge,
                },
                { color: item.color }
              );
            })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-0"
          )}
          onClick={async () => {
            await signOut();
            router.push("/auth/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>خروج از حساب</span>}
        </Button>
      </div>
    </aside>
  );
}
