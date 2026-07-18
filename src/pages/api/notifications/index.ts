import type { NextApiRequest, NextApiResponse } from "next";
import { notificationsRepo } from "@/server/notifications-repo";
import { requireSession } from "@/server/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }
  const { user } = session;

  if (req.method === "GET") {
    const notifications = notificationsRepo.listForUser(user.id);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return res.status(200).json({
      notifications,
      unreadCount,
      totalPages: 1,
      currentPage: 1,
    });
  }

  if (req.method === "POST") {
    const { notificationIds } = req.body || {};
    notificationsRepo.markRead(user.id, notificationIds);
    return res.status(200).json({ message: "اعلان‌ها خوانده شدند" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
