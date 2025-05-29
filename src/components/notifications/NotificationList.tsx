import { useNotification } from "@/contexts/NotificationContext";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/models/types";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export default function NotificationList({ notifications, onNotificationClick }: NotificationListProps) {
  return (
    <div className="divide-y">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Bell className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">هیچ اعلانی وجود ندارد.</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? "bg-primary/5" : ""}`}
            onClick={() => onNotificationClick(notification)}
            role="button"
            tabIndex={0}
            aria-label={notification.message}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNotificationClick(notification);
            }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Bell className="w-5 h-5 text-blue-500" aria-hidden />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-medium ${!notification.isRead ? "text-primary" : ""}`.trim()}>
                    {notification.message}
                    {!notification.isRead && (
                      <Badge variant="default" className="mr-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                        جدید
                      </Badge>
                    )}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
