export interface Ticket {
  id: string;
  title: string;
  description: string;
  ticketNumber: number | string;
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

export interface TicketWithRelations extends Ticket {
  status?: { id: string; name: string; isClosed: boolean } | null;
  priority?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  department?: { id: string; name: string } | null;
  branch?: { id: string; name: string } | null;
  creator?: { id: string; firstName: string; lastName: string } | null;
  assignee?: { id: string; firstName: string; lastName: string } | null;
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string } | null;
}

export interface CreateTicketData {
  title: string;
  description: string;
  statusId?: string;
  priorityId?: string;
  categoryId?: string;
  departmentId?: string;
  branchId?: string | null;
  creatorId?: string;
  assigneeId?: string | null;
}

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

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

const ticketService = {
  async createTicket(ticketData: CreateTicketData): Promise<TicketWithRelations | null> {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
        credentials: "include",
      });
      if (!response.ok) {
        const err = await parseJson(response);
        throw new Error(err?.message || "خطا در ایجاد تیکت");
      }
      return (await response.json()) as TicketWithRelations;
    } catch (error) {
      console.error("Error in createTicket:", error);
      throw error;
    }
  },

  async getTickets(
    filters: TicketFilters = {}
  ): Promise<{ tickets: TicketWithRelations[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });
      const qs = params.toString();
      const response = await fetch(`/api/tickets${qs ? `?${qs}` : ""}`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) return { tickets: [], count: 0 };
        throw new Error("خطا در دریافت تیکت‌ها");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        return { tickets: data, count: data.length };
      }
      return {
        tickets: data.tickets || [],
        count: data.count ?? data.totalTickets ?? (data.tickets?.length || 0),
      };
    } catch (error) {
      console.error("Error in getTickets:", error);
      return { tickets: [], count: 0 };
    }
  },

  async getTicketById(ticketId: string): Promise<TicketWithRelations | null> {
    const res = await fetch(`/api/tickets/${ticketId}`, { credentials: "include" });
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
      credentials: "include",
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
      credentials: "include",
    });
    if (!res.ok) throw new Error("خطا در ارسال پاسخ");
    return await res.json();
  },

  async closeTicket(ticketId: string): Promise<void> {
    const res = await fetch(`/api/tickets/${ticketId}/close`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("خطا در بستن تیکت");
  },

  async reopenTicket(ticketId: string): Promise<void> {
    const res = await fetch(`/api/tickets/${ticketId}/reopen`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("خطا در بازگشایی تیکت");
  },

  async deleteTicket(ticketId: string): Promise<boolean> {
    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.ok;
  },

  async getDashboardStats() {
    const res = await fetch("/api/dashboard", { credentials: "include" });
    if (!res.ok) throw new Error("خطا در دریافت آمار داشبورد");
    return res.json();
  },
};

export default ticketService;
