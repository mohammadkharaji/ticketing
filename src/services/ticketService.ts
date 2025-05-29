export interface Ticket {
  id: string;
  title: string;
  description: string;
  ticketNumber: number;
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
}

export interface TicketWithRelations extends Omit<Ticket, keyof Ticket> {
  id: string;
  title: string;
  description: string;
  ticketNumber: number;
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
  status?: {
    id: string;
    name: string;
    isClosed: boolean;
  } | null;
  priority?: {
    id: string;
    name: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
  department?: {
    id: string;
    name: string;
  } | null;
  branch?: {
    id: string;
    name: string;
  } | null;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface CreateTicketData {
  title: string;
  description: string;
  statusId: string;
  priorityId: string;
  categoryId: string;
  departmentId: string;
  branchId?: string | null;
  creatorId: string;
  assigneeId?: string | null;
}

const mapTicketResponse = (data: any): TicketWithRelations => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    ticketNumber: data.ticket_number,
    statusId: data.status_id,
    priorityId: data.priority_id,
    categoryId: data.category_id,
    departmentId: data.department_id,
    branchId: data.branch_id,
    creatorId: data.creator_id,
    assigneeId: data.assignee_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    status: data.status?.[0] ? {
      id: data.status[0].id,
      name: data.status[0].name,
      isClosed: data.status[0].is_closed,
    } : null,
    priority: data.priority?.[0] ? {
      id: data.priority[0].id,
      name: data.priority[0].name,
    } : null,
    category: data.category?.[0] ? {
      id: data.category[0].id,
      name: data.category[0].name,
    } : null,
    department: data.department?.[0] ? {
      id: data.department[0].id,
      name: data.department[0].name,
    } : null,
    branch: data.branch?.[0] ? {
      id: data.branch[0].id,
      name: data.branch[0].name,
    } : null,
    creator: data.creator?.[0] ? {
      id: data.creator[0].id,
      firstName: data.creator[0].first_name,
      lastName: data.creator[0].last_name,
    } : null,
    assignee: data.assignee?.[0] ? {
      id: data.assignee[0].id,
      firstName: data.assignee[0].first_name,
      lastName: data.assignee[0].last_name,
    } : null,
    replies: data.replies?.map(mapReplyResponse),
  };
};

const mapReplyResponse = (data: any): TicketReply => {
  return {
    id: data.id,
    ticketId: data.ticket_id,
    userId: data.user_id,
    message: data.message,
    createdAt: data.created_at,
    user: data.user?.[0] ? {
      id: data.user[0].id,
      firstName: data.user[0].first_name,
      lastName: data.user[0].last_name,
    } : null,
  };
};

const ticketService = {
  async createTicket(ticketData: CreateTicketData): Promise<TicketWithRelations | null> {
    try {
      // اگر روی سرور هستیم باید آدرس کامل باشد
      const isServer = typeof window === "undefined";
      const baseUrl = isServer
        ? process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
        : "";
      const url = isServer ? `${baseUrl}/api/tickets` : "/api/tickets";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
        credentials: "include", // ارسال کوکی سشن
      });
      if (!response.ok) throw new Error("خطا در ایجاد تیکت");
      const data = await response.json();
      return data as TicketWithRelations;
    } catch (error) {
      console.error("Error in createTicket:", error);
      return null;
    }
  },

  async getTickets(filters: {
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
    ticketNumber?: string; // اضافه شد
  } = {}): Promise<{ tickets: TicketWithRelations[]; count: number }> {
    // TODO: Implement backend logic to fetch tickets
    return {
      tickets: [],
      count: 0,
    };
  },

  async getTicketById(ticketId: string): Promise<TicketWithRelations | null> {
    const res = await fetch(`/api/tickets/${ticketId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async updateTicket(
    ticketId: string,
    updates: Partial<Omit<Ticket, "id" | "ticketNumber" | "createdAt">>
  ): Promise<TicketWithRelations> {
    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("خطا در بروزرسانی تیکت");
    return await res.json();
  },

  async addReply(data: {
    ticketId: string;
    userId: string;
    message: string;
  }): Promise<TicketReply> {
    const res = await fetch(`/api/tickets/${data.ticketId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: data.userId, message: data.message }),
    });
    if (!res.ok) throw new Error("خطا در ارسال پاسخ");
    return await res.json();
  },

  async closeTicket(ticketId: string): Promise<void> {
    const res = await fetch(`/api/tickets/${ticketId}/close`, { method: "POST" });
    if (!res.ok) throw new Error("خطا در بستن تیکت");
  },

  async reopenTicket(ticketId: string): Promise<void> {
    const res = await fetch(`/api/tickets/${ticketId}/reopen`, { method: "POST" });
    if (!res.ok) throw new Error("خطا در بازکردن مجدد تیکت");
  },

  async deleteTicket(ticketId: string): Promise<boolean> {
    const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
    return res.ok;
  },
};

export default ticketService;
