import type { NextApiRequest, NextApiResponse } from "next";
import { ticketRepo } from "@/server/ticket-repo";
import { requireSession } from "@/server/session";
import { notificationsRepo } from "@/server/notifications-repo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }
  const { user } = session;

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "شناسه تیکت نامعتبر است." });
  }

  const message = req.body?.message || req.body?.content;
  if (!message) {
    return res.status(400).json({ message: "متن پیام الزامی است." });
  }

  const ticket = ticketRepo.getById(id);
  if (!ticket) return res.status(404).json({ message: "تیکت پیدا نشد." });

  const reply = ticketRepo.addReply(id, {
    userId: user.id,
    message,
    user: {
      id: user.id,
      firstName: user.firstName || "کاربر",
      lastName: user.lastName || "",
    },
  });

  if (ticket.creatorId && ticket.creatorId !== user.id) {
    notificationsRepo.create({
      userId: ticket.creatorId,
      type: "new_message",
      message: `پاسخ جدید روی تیکت «${ticket.title}»`,
      link: `/tickets/${id}`,
    });
  }

  return res.status(201).json(reply);
}
