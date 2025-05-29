import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatPersianRelativeTime } from "@/lib/date-utils";
import { Notification } from "@/models/types";
import notificationService from "@/services/notificationService";

export function NotificationDropdown() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { notifications } = await notificationService.getNotificationsForUser(user.id, 1, 5);
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [user, isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id
              ? { ...n, isRead: true }
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    setIsOpen(false);
    // اگر اعلان به تیکت مربوط است، پیام را بررسی کن و آیدی تیکت را استخراج کن
    const ticketIdMatch = notification.message.match(/#(\d+)/);
    if (ticketIdMatch) {
      router.push(`/tickets/${ticketIdMatch[1]}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllNotificationsAsRead(user.id);
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          isRead: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {/* Absolutely guarantee only a single child: move ALL logic into a single <span> and do not use any conditional rendering outside it */}
        <Button variant="ghost" size="icon" className="relative">
          {(() => {
            // Compose the content as a single React element
            const badge = unreadCount > 0 ? (
              <span className="badge-container">
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              </span>
            ) : null;
            return (
              <span className="flex items-center">
                <Bell className="h-5 w-5" />
                {badge}
              </span>
            );
          })()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>اعلان‌ها</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-7"
            >
              علامت‌گذاری همه به عنوان خوانده شده
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            هیچ اعلانی وجود ندارد
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium text-sm">
                    {getNotificationTypeLabel(notification.type)}
                    {!notification.isRead && (
                      <Badge
                        variant="default"
                        className="mr-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                      >
                        جدید
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatPersianRelativeTime(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 w-full">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary"
              onClick={() => {
                setIsOpen(false);
                router.push("/notifications");
              }}
            >
              مشاهده همه اعلان‌ها
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
