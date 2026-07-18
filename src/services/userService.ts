export interface User {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role_id: string | null;
  department_id: string | null;
  is_active: boolean | null;
  phone_number: string | null;
  job_title: string | null;
}

export interface UserWithDepartment extends User {
  department?: { id: string; name: string } | null;
}

const userService = {
  async getUserById(userId: string): Promise<UserWithDepartment | null> {
    try {
      const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getUsers(
    filters: {
      role?: string;
      department_id?: string;
      is_active?: boolean;
      searchTerm?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{ users: UserWithDepartment[]; count: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.set("role", filters.role);
      if (filters.department_id) params.set("departmentId", filters.department_id);
      if (filters.is_active !== undefined)
        params.set("isActive", String(filters.is_active));
      if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.pageSize) params.set("limit", String(filters.pageSize));

      const res = await fetch(`/api/users?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) return { users: [], count: 0 };
      const data = await res.json();
      return {
        users: data.users || [],
        count: data.count ?? data.totalUsers ?? 0,
      };
    } catch {
      return { users: [], count: 0 };
    }
  },

  async createUser(payload: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    roleId?: string;
    departmentId?: string;
  }): Promise<User | null> {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "خطا در ایجاد کاربر");
    }
    return res.json();
  },
};

export default userService;
