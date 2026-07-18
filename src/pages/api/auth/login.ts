import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { buildSessionCookie } from "@/server/session";

const USERS_FILE = path.join(process.cwd(), "users.json");

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error loading users:", e);
  }
  return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, username, password } = req.body || {};
  const userField = (email || username || "").toString().trim();
  if (!userField || !password) {
    return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است" });
  }

  try {
    const users = loadUsers();
    const user = users.find(
      (u: any) =>
        (u.email === userField || u.username === userField) && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "ایمیل یا رمز عبور نادرست است" });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: "حساب کاربری غیرفعال است" });
    }

    res.setHeader("Set-Cookie", buildSessionCookie(user.id));
    const { password: _pw, ...safe } = user;
    return res.status(200).json({
      user: safe,
      session: {
        token: `devtoken:${user.id}`,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "خطای سرور", error: String(error) });
  }
}
