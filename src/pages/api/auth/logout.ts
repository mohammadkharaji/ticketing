import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "@/server/session";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ message: "خروج با موفقیت انجام شد" });
}
