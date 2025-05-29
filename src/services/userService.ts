// Supabase imports removed. Data fetching will need to be reimplemented with the new backend.
// import { supabase } from "@/integrations/supabase/client";
// import type { Database } from "@/integrations/supabase/types";
// import type { User as AuthUser, AdminUserAttributes } from "@supabase/supabase-js";

// type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
// type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
// type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Assuming ProfileRow equivalent structure for User. Adjust as per new backend schema.
export interface User {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role_id: string | null; // Assuming role is a string ID, adjust if it's an object or enum
  department_id: string | null; // Assuming department_id is a string ID
  is_active: boolean | null;
  phone_number: string | null;
  job_title: string | null;
  // Add other fields from ProfileRow as needed
}

export interface UserWithDepartment extends User {
  department?: {
    id: string;
    name: string;
  } | null;
}

// In-memory user store (for development/testing only)
const users: User[] = [];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const userService = {
  async getUserById(userId: string): Promise<UserWithDepartment | null> {
    // This must be implemented via API call in the browser/client, not via fs
    // Example placeholder:
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getUsers(filters: {
    role?: string;
    department_id?: string;
    is_active?: boolean;
    searchTerm?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ users: UserWithDepartment[]; count: number }> {
    // let query = supabase
    //   .from("profiles")
    //   .select(`
    //     *,
    //     department:departments(id, name)
    //   `, { count: "exact" })
    //   .order("created_at", { ascending: false });
    // 
    // if (filters.role) query = query.eq("role_id", filters.role);
    // if (filters.department_id) query = query.eq("department_id", filters.department_id);
    // if (filters.is_active !== undefined) query = query.eq("is_active", filters.is_active);
    // if (filters.searchTerm) {
    //   query = query.or(`first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%`);
    // }
    // 
    // if (filters.page && filters.pageSize) {
    //   const from = (filters.page - 1) * filters.pageSize;
    //   const to = from + filters.pageSize - 1;
    //   query = query.range(from, to);
    // }
    // 
    // const { data, error, count } = await query;
    // 
    // if (error) throw error;

    // // Get all user emails from auth.users
    // const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    // const emailMap = new Map<string, string>();
    // 
    // if (authUsers) {
    //   authUsers.forEach((user: AdminUserAttributes) => {
    //     if (user.id && user.email) {
    //       emailMap.set(user.id, user.email);
    //     }
    //   });
    // }
    // 
    // const users = data.map(item => ({
    //   ...item,
    //   email: emailMap.get(item.id) || "",
    //   department: item.department?.[0] || null
    // })) as UserWithDepartment[];
    // 
    // return { users, count: count || 0 };
    console.warn("getUsers needs reimplementation without Supabase.", filters);
    return { users: [], count: 0 }; // Placeholder
  },

  async updateUser(userId: string, updates: Partial<Omit<User, "id" | "created_at" | "updated_at" | "email" | "department">>): Promise<User | null> {
    // const updateData: ProfileUpdate = {
    //   updated_at: new Date().toISOString(),
    //   ...updates
    // };
    // 
    // const { data, error } = await supabase
    //   .from("profiles")
    //   .update(updateData)
    //   .eq("id", userId)
    //   .select()
    //   .single();
    // 
    // if (error) throw error;
    // 
    // const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    // 
    // return {
    //   ...data,
    //   email: user?.email || "",
    // } as User;
    console.warn("updateUser needs reimplementation without Supabase.", userId, updates);
    // Placeholder: Fetch the user and apply updates locally, or assume success
    const mockUser = await this.getUserById(userId);
    if (mockUser) {
      return { ...mockUser, ...updates, updated_at: new Date().toISOString() } as User;
    }
    return null;
  },

  async getUsersByDepartment(departmentId: string): Promise<User[]> {
    // const { data, error } = await supabase
    //   .from("profiles")
    //   .select()
    //   .eq("department_id", departmentId)
    //   .eq("is_active", true)
    //   .order("first_name", { ascending: true });
    // 
    // if (error) throw error;

    // const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    // const emailMap = new Map<string, string>();
    // 
    // if (authUsers) {
    //   authUsers.forEach((user: AdminUserAttributes) => {
    //     if (user.id && user.email) {
    //       emailMap.set(user.id, user.email);
    //     }
    //   });
    // }

    // return data.map(user => ({
    //   ...user,
    //   email: emailMap.get(user.id) || "",
    // })) as User[];
    console.warn("getUsersByDepartment needs reimplementation without Supabase.", departmentId);
    return []; // Placeholder
  },

  async getSupportAgents(): Promise<User[]> {
    // const { data, error } = await supabase
    //   .from("profiles")
    //   .select()
    //   .eq("role_id", "support")
    //   .eq("is_active", true)
    //   .order("first_name", { ascending: true });
    // 
    // if (error) throw error;

    // const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    // const emailMap = new Map<string, string>();
    // 
    // if (authUsers) {
    //   authUsers.forEach((user: AdminUserAttributes) => {
    //     if (user.id && user.email) {
    //       emailMap.set(user.id, user.email);
    //     }
    //   });
    // }

    // return data.map(user => ({
    //   ...user,
    //   email: emailMap.get(user.id) || "",
    // })) as User[];
    console.warn("getSupportAgents needs reimplementation without Supabase.");
    return []; // Placeholder
  },

  async getAdmins(): Promise<User[]> {
    // const { data, error } = await supabase
    //   .from("profiles")
    //   .select()
    //   .eq("role_id", "admin")
    //   .eq("is_active", true)
    //   .order("first_name", { ascending: true });
    // 
    // if (error) throw error;

    // const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    // const emailMap = new Map<string, string>();
    // 
    // if (authUsers) {
    //   authUsers.forEach((user: AdminUserAttributes) => {
    //     if (user.id && user.email) {
    //       emailMap.set(user.id, user.email);
    //     }
    //   });
    // }

    // return data.map(user => ({
    //   ...user,
    //   email: emailMap.get(user.id) || "",
    // })) as User[];
    console.warn("getAdmins needs reimplementation without Supabase.");
    return []; // Placeholder
  },

  async createUser({ email, password, firstName, lastName, roleId, departmentId }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: string;
    departmentId?: string | null;
  }): Promise<User> {
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    const user: User = {
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email,
      first_name: firstName,
      last_name: lastName,
      avatar_url: null,
      role_id: roleId,
      department_id: departmentId || null,
      is_active: true,
      phone_number: null,
      job_title: null,
    };
    (user as any).password = password;
    users.push(user);
    return user;
  },

  async findUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const user = users.find(u => u.email === email && (u as any).password === password);
    return user || null;
  },
};

export default userService;
