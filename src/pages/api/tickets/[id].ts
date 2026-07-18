import type { NextApiRequest, NextApiResponse } from "next";
import { ticketRepo } from "@/server/ticket-repo";
import { requireSession } from "@/server/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "شناسه تیکت نامعتبر است." });
  }

  switch (req.method) {
    case "GET": {
      const ticket = ticketRepo.getById(id);
      if (!ticket) return res.status(404).json({ message: "تیکت پیدا نشد." });
      return res.status(200).json(ticket);
    }
    case "PUT":
    case "PATCH": {
      const updates = req.body || {};
      const result = ticketRepo.update(id, updates);
      if (!result) return res.status(404).json({ message: "تیکت پیدا نشد." });
      return res.status(200).json(result);
    }
    case "DELETE": {
      if (session.user.roleId !== "admin") {
        return res.status(403).json({ message: "فقط مدیر سیستم می‌تواند تیکت را حذف کند." });
      }
      const ok = ticketRepo.remove(id);
      return res.status(ok ? 200 : 404).json({ success: ok });
    }
    default:
      res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
