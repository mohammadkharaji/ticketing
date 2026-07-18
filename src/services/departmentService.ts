import { Department } from "../models/types";

const departmentService = {
  async getDepartments(): Promise<Department[]> {
    try {
      const res = await fetch("/api/departments", { credentials: "include" });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async getDepartmentById(id: string): Promise<Department | null> {
    const all = await this.getDepartments();
    return all.find((d) => d.id === id) || null;
  },

  async updateDepartment(id: string, updates: Partial<Department>): Promise<boolean> {
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteDepartment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async createDepartment(
    departmentData: Omit<Department, "id" | "createdAt" | "updatedAt">
  ): Promise<Department | null> {
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentData),
        credentials: "include",
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};

export default departmentService;
