import type { NextApiRequest } from "next";
import fs from "fs";
import path from "path";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roleId: string | null;
  departmentId: string | null;
  branchId?: string | null;
  isActive: boolean;
};

function getCookie(req: NextApiRequest, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  const match = raw
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.slice(name.length + 1));
}

function loadUsers(): any[] {
  const file = path.join(process.cwd(), "users.json");
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

export function getSessionUser(req: NextApiRequest): SessionUser | null {
  const token = getCookie(req, "auth_token");
  if (!token) return null;

  const users = loadUsers();
  let found: any;

  if (token.startsWith("devtoken:")) {
    const userId = token.slice("devtoken:".length);
    found = users.find((u) => u.id === userId);
  } else if (token.startsWith("devtoken")) {
    found = users[0];
  }

  if (!found) return null;

  return {
    id: found.id,
    email: found.email,
    firstName: found.first_name ?? found.firstName ?? null,
    lastName: found.last_name ?? found.lastName ?? null,
    roleId: found.role_id ?? found.roleId ?? null,
    departmentId: found.department_id ?? found.departmentId ?? null,
    branchId: found.branch_id ?? found.branchId ?? null,
    isActive: found.is_active ?? found.isActive ?? true,
  };
}

export function requireSession(
  req: NextApiRequest
): { user: SessionUser } | { error: string; status: number } {
  const user = getSessionUser(req);
  if (!user) return { error: "لطفاً وارد سیستم شوید", status: 401 };
  if (!user.isActive) return { error: "حساب کاربری غیرفعال است", status: 403 };
  return { user };
}

export function buildSessionCookie(userId: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const token = `devtoken:${userId}`;
  const parts = [
    `auth_token=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=86400",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie(): string {
  return "auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax";
}
