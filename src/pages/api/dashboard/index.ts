import type { NextApiRequest, NextApiResponse } from "next";
import { ticketRepo } from "@/server/ticket-repo";
import { requireSession } from "@/server/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }

  const stats = ticketRepo.stats();
  return res.status(200).json({
    totalTickets: stats.total,
    openTickets: stats.open,
    inProgressTickets: stats.inProgress,
    waitingTickets: stats.waiting,
    closedTickets: stats.closed,
    recentTickets: stats.recent,
    user: {
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      roleId: session.user.roleId,
    },
  });
}
