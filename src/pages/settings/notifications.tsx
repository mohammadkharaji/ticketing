import React, { useEffect, useState } from "react";
import notificationService from "@/services/notificationService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import NotificationList from "@/components/notifications/NotificationList";

export default function SettingsNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchNotifications() {
      setLoading(true);
      const { notifications } = await notificationService.getNotificationsForUser(user.id);
      setNotifications(notifications);
      setLoading(false);
    }
    fetchNotifications();
  }, [user]);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>اعلان‌های من</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>در حال بارگذاری...</div>
          ) : (
            <NotificationList notifications={notifications} onNotificationClick={() => {}} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
