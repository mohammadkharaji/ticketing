import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/layouts/Header";
import { RequireAuth } from "@/components/auth/RequireAuth";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { userProfile } = useAuth();
  const { isOpen, setOpen, isCollapsed, setCollapsed } = useSidebar();
  const profile = userProfile;
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);

  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (sidebarOpen !== isOpen) {
      setOpen(sidebarOpen);
    }
  }, [sidebarOpen, isOpen, setOpen]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      setOpen(next);
      return next;
    });
  }, [setOpen]);

  const handleCollapseChange = useCallback(
    (collapsed: boolean) => {
      setCollapsed(collapsed);
    },
    [setCollapsed]
  );

  const sidebarProfile = {
    first_name: profile?.firstName || "کاربر",
    last_name: profile?.lastName || "سیستم",
    role_id: profile?.roleId || "user",
    avatar_url: undefined as string | undefined,
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background flex flex-row-reverse rtl">
        <Sidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          user={sidebarProfile}
          onCollapseChange={handleCollapseChange}
        />
        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{
            marginRight: isMobile ? "0" : isCollapsed ? "4.5rem" : "18rem",
          }}
        >
          <Header onMenuClick={handleOpenSidebar} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
