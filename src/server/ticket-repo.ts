import { readJsonFile, writeJsonFile, uid } from "./json-store";

export type TicketRecord = {
  id: string;
  title: string;
  description: string;
  ticketNumber: string | number;
  statusId: string;
  priorityId: string;
  categoryId: string;
  departmentId: string;
  branchId?: string | null;
  creatorId: string;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  status?: { id: string; name: string; isClosed: boolean } | null;
  priority?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  department?: { id: string; name: string } | null;
  branch?: { id: string; name: string } | null;
  creator?: { id: string; firstName: string; lastName: string } | null;
  assignee?: { id: string; firstName: string; lastName: string } | null;
  replies?: TicketReplyRecord[];
};

export type TicketReplyRecord = {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string } | null;
};

export type TicketFilters = {
  statusId?: string;
  priorityId?: string;
  categoryId?: string;
  departmentId?: string;
  branchId?: string;
  creatorId?: string;
  assigneeId?: string;
  userId?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  ticketNumber?: string;
};

const FILE = "tickets.json";

const STATUS_META: Record<string, { name: string; isClosed: boolean }> = {
  open: { name: "باز", isClosed: false },
  in_progress: { name: "در حال بررسی", isClosed: false },
  waiting: { name: "در انتظار", isClosed: false },
  closed: { name: "بسته", isClosed: true },
  resolved: { name: "حل‌شده", isClosed: true },
};

const PRIORITY_META: Record<string, string> = {
  high: "بالا",
  medium: "متوسط",
  low: "کم",
  urgent: "فوری",
};

const DEPT_META: Record<string, string> = {
  it: "فناوری اطلاعات",
  hr: "منابع انسانی",
  finance: "مالی",
  sales: "فروش",
  support: "پشتیبانی",
};

function enrich(ticket: TicketRecord): TicketRecord {
  const statusId = ticket.statusId || "open";
  const priorityId = ticket.priorityId || "medium";
  const departmentId = ticket.departmentId || "it";
  return {
    ...ticket,
    status: ticket.status || {
      id: statusId,
      name: STATUS_META[statusId]?.name || statusId,
      isClosed: STATUS_META[statusId]?.isClosed ?? false,
    },
    priority: ticket.priority || {
      id: priorityId,
      name: PRIORITY_META[priorityId] || priorityId,
    },
    category: ticket.category || {
      id: ticket.categoryId || "general",
      name: "عمومی",
    },
    department: ticket.department || {
      id: departmentId,
      name: DEPT_META[departmentId] || departmentId,
    },
    replies: ticket.replies || [],
  };
}

function seedTickets(): TicketRecord[] {
  const now = Date.now();
  const day = 86400000;
  const samples: Omit<TicketRecord, "status" | "priority" | "category" | "department" | "replies">[] = [
    {
      id: "tkt_demo_1",
      title: "مشکل اتصال به شبکه داخلی",
      description: "از صبح امکان اتصال به VPN سازمان وجود ندارد. لطفاً بررسی شود.",
      ticketNumber: "2114040101",
      statusId: "open",
      priorityId: "high",
      categoryId: "network",
      departmentId: "it",
      branchId: "211",
      creatorId: "tugv0486c",
      assigneeId: null,
      createdAt: new Date(now - day).toISOString(),
      updatedAt: new Date(now - day).toISOString(),
      closedAt: null,
      creator: { id: "tugv0486c", firstName: "Admin", lastName: "User" },
    },
    {
      id: "tkt_demo_2",
      title: "درخواست دسترسی به سامانه مالی",
      description: "کاربر جدید شعبه نیاز به دسترسی گزارش‌های مالی دارد.",
      ticketNumber: "2114040102",
      statusId: "in_progress",
      priorityId: "medium",
      categoryId: "access",
      departmentId: "finance",
      branchId: "211",
      creatorId: "tugv0486c",
      assigneeId: "tugv0486c",
      createdAt: new Date(now - 2 * day).toISOString(),
      updatedAt: new Date(now - day / 2).toISOString(),
      closedAt: null,
      creator: { id: "tugv0486c", firstName: "Admin", lastName: "User" },
      assignee: { id: "tugv0486c", firstName: "Admin", lastName: "User" },
    },
    {
      id: "tkt_demo_3",
      title: "خطا در چاپ فیش حقوقی",
      description: "فیش حقوقی ماه گذشته برای چند نفر چاپ نمی‌شود.",
      ticketNumber: "3014040101",
      statusId: "waiting",
      priorityId: "medium",
      categoryId: "hr",
      departmentId: "hr",
      branchId: "301",
      creatorId: "tugv0486c",
      assigneeId: null,
      createdAt: new Date(now - 3 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString(),
      closedAt: null,
      creator: { id: "tugv0486c", firstName: "Admin", lastName: "User" },
    },
    {
      id: "tkt_demo_4",
      title: "به‌روزرسانی نرم‌افزار صندوق",
      description: "نسخه جدید نرم‌افزار صندوق نصب و تست شد.",
      ticketNumber: "2114040103",
      statusId: "closed",
      priorityId: "low",
      categoryId: "software",
      departmentId: "it",
      branchId: "211",
      creatorId: "tugv0486c",
      assigneeId: "tugv0486c",
      createdAt: new Date(now - 5 * day).toISOString(),
      updatedAt: new Date(now - 4 * day).toISOString(),
      closedAt: new Date(now - 4 * day).toISOString(),
      creator: { id: "tugv0486c", firstName: "Admin", lastName: "User" },
    },
    {
      id: "tkt_demo_5",
      title: "کندی سیستم فروش",
      description: "در ساعات پیک، ثبت فاکتور بیش از ۳۰ ثانیه طول می‌کشد.",
      ticketNumber: "3024040101",
      statusId: "open",
      priorityId: "urgent",
      categoryId: "performance",
      departmentId: "sales",
      branchId: "302",
      creatorId: "tugv0486c",
      assigneeId: null,
      createdAt: new Date(now - 6 * hourMs()).toISOString(),
      updatedAt: new Date(now - 6 * hourMs()).toISOString(),
      closedAt: null,
      creator: { id: "tugv0486c", firstName: "Admin", lastName: "User" },
    },
  ];

  return samples.map((t) => enrich(t as TicketRecord));
}

function hourMs() {
  return 3600000;
}

function loadAll(): TicketRecord[] {
  const data = readJsonFile<TicketRecord[]>(FILE, []);
  if (!data.length) {
    const seeded = seedTickets();
    writeJsonFile(FILE, seeded);
    return seeded;
  }
  return data.map(enrich);
}

function saveAll(tickets: TicketRecord[]) {
  writeJsonFile(FILE, tickets);
}

export const ticketRepo = {
  list(filters: TicketFilters = {}): { tickets: TicketRecord[]; count: number } {
    let tickets = loadAll();

    if (filters.statusId) tickets = tickets.filter((t) => t.statusId === filters.statusId);
    if (filters.priorityId) tickets = tickets.filter((t) => t.priorityId === filters.priorityId);
    if (filters.categoryId) tickets = tickets.filter((t) => t.categoryId === filters.categoryId);
    if (filters.departmentId) tickets = tickets.filter((t) => t.departmentId === filters.departmentId);
    if (filters.branchId) tickets = tickets.filter((t) => t.branchId === filters.branchId);
    if (filters.creatorId) tickets = tickets.filter((t) => t.creatorId === filters.creatorId);
    if (filters.assigneeId) tickets = tickets.filter((t) => t.assigneeId === filters.assigneeId);
    if (filters.userId) {
      tickets = tickets.filter(
        (t) => t.creatorId === filters.userId || t.assigneeId === filters.userId
      );
    }
    if (filters.ticketNumber) {
      const q = String(filters.ticketNumber);
      tickets = tickets.filter((t) => String(t.ticketNumber).includes(q));
    }
    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          String(t.ticketNumber).includes(q)
      );
    }

    tickets.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const count = tickets.length;
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.max(1, filters.pageSize || 50);
    const start = (page - 1) * pageSize;
    tickets = tickets.slice(start, start + pageSize);

    return { tickets, count };
  },

  getById(id: string): TicketRecord | null {
    const t = loadAll().find((x) => x.id === id);
    return t ? enrich(t) : null;
  },

  create(input: {
    title: string;
    description: string;
    statusId?: string;
    priorityId?: string;
    categoryId?: string;
    departmentId?: string;
    branchId?: string | null;
    creatorId: string;
    assigneeId?: string | null;
    ticketNumber?: string | number;
    creator?: { id: string; firstName: string; lastName: string } | null;
  }): TicketRecord {
    const tickets = loadAll();
    const now = new Date().toISOString();
    const statusId = input.statusId || "open";
    const ticket: TicketRecord = enrich({
      id: uid("tkt"),
      title: input.title,
      description: input.description,
      ticketNumber: input.ticketNumber || `TKT${Date.now().toString().slice(-8)}`,
      statusId,
      priorityId: input.priorityId || "medium",
      categoryId: input.categoryId || "general",
      departmentId: input.departmentId || "support",
      branchId: input.branchId ?? null,
      creatorId: input.creatorId,
      assigneeId: input.assigneeId ?? null,
      createdAt: now,
      updatedAt: now,
      closedAt: null,
      creator: input.creator || null,
      replies: [],
    });
    tickets.unshift(ticket);
    saveAll(tickets);
    return ticket;
  },

  update(id: string, updates: Partial<TicketRecord>): TicketRecord | null {
    const tickets = loadAll();
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx < 0) return null;
    const next = enrich({
      ...tickets[idx],
      ...updates,
      id: tickets[idx].id,
      updatedAt: new Date().toISOString(),
    });
    if (updates.statusId === "closed" || updates.statusId === "resolved") {
      next.closedAt = next.closedAt || new Date().toISOString();
    }
    tickets[idx] = next;
    saveAll(tickets);
    return next;
  },

  remove(id: string): boolean {
    const tickets = loadAll();
    const next = tickets.filter((t) => t.id !== id);
    if (next.length === tickets.length) return false;
    saveAll(next);
    return true;
  },

  addReply(
    ticketId: string,
    reply: { userId: string; message: string; user?: TicketReplyRecord["user"] }
  ): TicketReplyRecord | null {
    const tickets = loadAll();
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx < 0) return null;
    const record: TicketReplyRecord = {
      id: uid("rpl"),
      ticketId,
      userId: reply.userId,
      message: reply.message,
      createdAt: new Date().toISOString(),
      user: reply.user || null,
    };
    const replies = [...(tickets[idx].replies || []), record];
    tickets[idx] = enrich({
      ...tickets[idx],
      replies,
      updatedAt: new Date().toISOString(),
      statusId:
        tickets[idx].statusId === "open" ? "in_progress" : tickets[idx].statusId,
    });
    saveAll(tickets);
    return record;
  },

  stats() {
    const tickets = loadAll();
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.statusId === "open").length,
      inProgress: tickets.filter((t) => t.statusId === "in_progress").length,
      waiting: tickets.filter((t) => t.statusId === "waiting").length,
      closed: tickets.filter((t) => t.statusId === "closed" || t.statusId === "resolved")
        .length,
      recent: tickets.slice(0, 8),
    };
  },
};
