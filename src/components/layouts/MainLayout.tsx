import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/layouts/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { user, userProfile, loading: isLoading } = useAuth();
  const { isOpen, toggleSidebar, setOpen, isCollapsed, setCollapsed } = useSidebar();
  const profile = userProfile;
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showError, setShowError] = useState(false);
  
  console.log("MainLayout rendering. Auth state:", { 
    isLoading, 
    user: user ? "exists" : "null", 
    profile: profile ? "exists" : "null",
    isMobile,
    sidebarOpen,
    isCollapsed
  });
  
  // Sync with SidebarContext
  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);
  
  // Sync back to SidebarContext when sidebar state changes
  useEffect(() => {
    if (sidebarOpen !== isOpen) {
      setOpen(sidebarOpen);
    }
  }, [sidebarOpen, isOpen, setOpen]);
  
  // Auto-adjust sidebar based on mobile/desktop view
  useEffect(() => {
    if (!isMobile) {
      // On desktop, always show sidebar
      setSidebarOpen(true);
    } else {
      // On mobile, hide sidebar
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  // When opening sidebar, inform the SidebarContext
  const handleOpenSidebar = () => {
    const newOpenState = !sidebarOpen;
    setSidebarOpen(newOpenState);
    setOpen(newOpenState);
  };
  
  // Handle sidebar collapse
  const handleCollapseChange = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };
  
  useEffect(() => {
    if (isLoading) {
      setShowSpinner(true);
      setShowError(false);
      const timer = setTimeout(() => {
        setShowSpinner(false);
        setShowError(true);
      }, 3000); // 3 seconds timeout
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
      setShowError(false);
    }
  }, [isLoading]);
  
  // Normalize profile fields for Sidebar compatibility
  const sidebarProfile =
    (profile && {
      ...profile,
      first_name: profile.firstName || "کاربر",
      last_name: profile.lastName || "سیستم",
      role_id: profile.roleId || "admin",
    }) || {
      first_name: "کاربر",
      last_name: "سیستم",
      role_id: "admin",
    };

  if (isLoading && showSpinner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">در حال بارگذاری...</h2>
          <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isLoading && showError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-red-600">خطا در بارگذاری</h2>
          <p className="text-gray-600">متأسفانه در بارگذاری اطلاعات کاربری مشکلی رخ داده است.</p>
          <div className="mt-4">
            <Link href="/auth/login" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              رفتن به صفحه ورود
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse rtl">
      {/* Sidebar component */}
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        user={sidebarProfile}
        onCollapseChange={handleCollapseChange}
      />
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ 
          marginRight: isMobile ? '0' : (isCollapsed ? '4rem' : '16rem')
        }}
      >
        <Header onMenuClick={handleOpenSidebar} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
