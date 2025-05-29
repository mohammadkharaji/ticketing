import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Bell, CheckCircle, MessageCircle, AlertCircle, Ticket } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { formatPersianRelativeTime } from "@/lib/date-utils"; // مسیر صحیح
import notificationService from "@/services/notificationService";
import { Notification } from "@/models/types";

// Define the notification type locally
interface NotificationWithRelations {
  id: string;
  type: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

import { toast } from "@/hooks/use-toast";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const pageSize = 10;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchNotifications();
    }
  }, [user, authLoading, router, activeTab, currentPage]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { notifications, count } = await notificationService.getNotificationsForUser(user.id, currentPage, pageSize, { read: activeTab === "unread" ? false : undefined });
      setNotifications(notifications);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) return;
    try {
      await notificationService.markNotificationAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id
            ? { ...n, isRead: true }
            : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllNotificationsAsRead(user.id);
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          isRead: true,
        }))
      );
      toast({
        title: "همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند",
        variant: "default",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "خطا در علامت‌گذاری اعلان‌ها",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification);
    // اگر اعلان به تیکت مربوط است، آیدی را از پیام استخراج کن
    const ticketIdMatch = notification.message.match(/#(\d+)/);
    if (ticketIdMatch) {
      router.push(`/tickets/${ticketIdMatch[1]}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_ticket":
        return <Ticket className="h-5 w-5 text-primary" />;
      case "ticket_reply":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "ticket_status_change":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "ticket_assigned":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "new_ticket":
        return "تیکت جدید";
      case "ticket_reply":
        return "پاسخ تیکت";
      case "ticket_status_change":
        return "تغییر وضعیت تیکت";
      case "ticket_assigned":
        return "انتساب تیکت";
      default:
        return type;
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  if (isLoading || authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>اعلان‌ها | سیستم مدیریت تیکت‌های سازمانی</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">اعلان‌ها</h1>
            <p className="text-muted-foreground">مدیریت اعلان‌ها و پیام‌های سیستم</p>
          </div>
          <Button 
            variant="outline" 
            onClick={markAllAsRead} 
            disabled={getUnreadCount() === 0}
          >
            علامت‌گذاری همه به عنوان خوانده شده
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">
                همه
              </TabsTrigger>
              <TabsTrigger value="unread">
                خوانده نشده
                {getUnreadCount() > 0 && (
                  <Badge variant="secondary" className="mr-2 bg-primary text-primary-foreground">
                    {getUnreadCount()}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            {renderNotificationsList()}
          </TabsContent>
          
          <TabsContent value="unread" className="space-y-4">
            {renderNotificationsList()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );

  function renderNotificationsList() {
    if (notifications.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {activeTab === "all" ? "هیچ اعلانی وجود ندارد." : "هیچ اعلان خوانده نشده‌ای وجود ندارد."}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${!notification.isRead ? "text-primary" : ""}`}>
                          {getNotificationTypeLabel(notification.type)}
                          {!notification.isRead && (
                            <Badge variant="default" className="mr-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                              جدید
                            </Badge>
                          )}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatPersianRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {totalCount > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    );
  }
}
