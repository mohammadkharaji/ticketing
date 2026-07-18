import type { NextApiRequest, NextApiResponse } from "next";
import { ticketRepo } from "@/server/ticket-repo";
import { requireSession } from "@/server/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "شناسه تیکت نامعتبر است." });
  }

  const ticket = ticketRepo.update(id, {
    statusId: "closed",
    closedAt: new Date().toISOString(),
  });
  if (!ticket) return res.status(404).json({ message: "تیکت پیدا نشد." });
  return res.status(200).json(ticket);
}
