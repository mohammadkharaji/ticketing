import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns-jalali";
import { ticketRepo } from "@/server/ticket-repo";
import { requireSession } from "@/server/session";
import { notificationsRepo } from "@/server/notifications-repo";

const BRANCH_CODE_MAP: Record<string, string> = {
  "211": "21",
  "212": "21",
  "214": "21",
  "215": "21",
  "216": "21",
  "301": "51",
  "302": "31",
  "303": "71",
};

function generateTicketNumber(branchId?: string | null) {
  const branchCode = BRANCH_CODE_MAP[branchId || ""] || branchId || "21";
  const shamsiDate = format(new Date(), "yyyyMMdd");
  const { tickets } = ticketRepo.list({ branchId: branchId || undefined, pageSize: 500 });
  const todayPrefix = `${branchCode}${shamsiDate}`;
  let maxNo = 0;
  for (const t of tickets) {
    const num = String(t.ticketNumber);
    if (num.startsWith(todayPrefix)) {
      const seq = Number(num.slice(-2));
      if (!Number.isNaN(seq)) maxNo = Math.max(maxNo, seq);
    }
  }
  const nextNo = String(maxNo + 1).padStart(2, "0");
  return `${todayPrefix}${nextNo}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }
  const { user } = session;

  switch (req.method) {
    case "GET": {
      const {
        statusId,
        priorityId,
        categoryId,
        departmentId,
        branchId,
        creatorId,
        assigneeId,
        userId,
        searchTerm,
        page,
        pageSize,
        ticketNumber,
      } = req.query;

      const filters = {
        statusId: statusId as string | undefined,
        priorityId: priorityId as string | undefined,
        categoryId: categoryId as string | undefined,
        departmentId: departmentId as string | undefined,
        branchId: branchId as string | undefined,
        creatorId: creatorId as string | undefined,
        assigneeId: assigneeId as string | undefined,
        userId: userId as string | undefined,
        searchTerm: searchTerm as string | undefined,
        ticketNumber: ticketNumber as string | undefined,
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 50,
      };

      // Non-admin users only see own tickets unless filters already set
      if (user.roleId !== "admin" && !filters.userId && !filters.departmentId) {
        filters.userId = user.id;
      }

      const result = ticketRepo.list(filters);
      return res.status(200).json(result);
    }

    case "POST": {
      const body = req.body || {};
      if (!body.title || !body.description) {
        return res.status(400).json({ message: "عنوان و توضیحات الزامی است" });
      }

      const ticketNumber = generateTicketNumber(body.branchId);
      const ticket = ticketRepo.create({
        title: body.title,
        description: body.description,
        statusId: body.statusId || "open",
        priorityId: body.priorityId || body.priority || "medium",
        categoryId: body.categoryId || "general",
        departmentId: body.departmentId || "support",
        branchId: body.branchId ?? null,
        creatorId: body.creatorId || user.id,
        assigneeId: body.assigneeId ?? null,
        ticketNumber,
        creator: {
          id: user.id,
          firstName: user.firstName || "کاربر",
          lastName: user.lastName || "",
        },
      });

      notificationsRepo.create({
        userId: user.id,
        type: "ticket_created",
        message: `تیکت «${ticket.title}» با موفقیت ثبت شد`,
        link: `/tickets/${ticket.id}`,
      });

      return res.status(201).json(ticket);
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
