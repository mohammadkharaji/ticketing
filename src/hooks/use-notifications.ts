import { useEffect } from "react";
import notificationService from "@/services/notificationService";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

// هوک ساده برای دریافت و بروزرسانی تعداد اعلان‌های خوانده‌نشده
export function useNotificationsFetcher() {
  const { user } = useAuth();
  const { setUnreadCount } = useNotification();

  useEffect(() => {
    async function fetchUnread() {
      if (!user) return;
      const { notifications } = await notificationService.getNotificationsForUser(user.id, 1, 100);
      const unread = notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    }
    fetchUnread();
  }, [user, setUnreadCount]);
}
