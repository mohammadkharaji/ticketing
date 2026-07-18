import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireSession } from "@/server/session";

const USERS_FILE = path.join(process.cwd(), "users.json");

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function stripPassword(u: any) {
  const { password, ...rest } = u;
  return rest;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }

  let users = loadUsers();

  if (req.method === "GET") {
    const { role, departmentId, isActive, page, limit, searchTerm } = req.query;
    let filtered = [...users];

    if (role) filtered = filtered.filter((u: any) => u.role_id === role);
    if (departmentId)
      filtered = filtered.filter((u: any) => u.department_id === departmentId);
    if (isActive !== undefined)
      filtered = filtered.filter((u: any) => u.is_active === (isActive === "true"));
    if (searchTerm) {
      const term = String(searchTerm).toLowerCase();
      filtered = filtered.filter(
        (u: any) =>
          u.email?.toLowerCase().includes(term) ||
          u.first_name?.toLowerCase().includes(term) ||
          u.last_name?.toLowerCase().includes(term)
      );
    }

    const pageNum = page ? parseInt(String(page), 10) : 1;
    const pageSize = limit ? parseInt(String(limit), 10) : 50;
    const total = filtered.length;
    const from = (pageNum - 1) * pageSize;
    const paged = filtered.slice(from, from + pageSize).map(stripPassword);

    return res.status(200).json({
      users: paged,
      count: total,
      totalUsers: total,
      currentPage: pageNum,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  }

  if (req.method === "POST") {
    if (session.user.roleId !== "admin") {
      return res.status(403).json({ message: "فقط مدیر می‌تواند کاربر بسازد" });
    }
    const body = req.body || {};
    if (!body.email || !body.password) {
      return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است" });
    }
    if (users.some((u: any) => u.email === body.email)) {
      return res.status(409).json({ message: "این ایمیل قبلاً ثبت شده است" });
    }
    const now = new Date().toISOString();
    const user = {
      id: `usr_${Date.now().toString(36)}`,
      created_at: now,
      updated_at: now,
      email: body.email,
      first_name: body.firstName || body.first_name || "",
      last_name: body.lastName || body.last_name || "",
      avatar_url: null,
      role_id: body.roleId || body.role_id || "user",
      department_id: body.departmentId || body.department_id || null,
      is_active: true,
      phone_number: body.phone || null,
      job_title: body.jobTitle || null,
      password: body.password,
    };
    users.push(user);
    saveUsers(users);
    return res.status(201).json(stripPassword(user));
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
