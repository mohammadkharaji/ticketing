import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionUser } from "@/server/session";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json(user);
}
