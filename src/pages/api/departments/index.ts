import type { NextApiRequest, NextApiResponse } from "next";
import { departmentRepo } from "@/server/department-repo";
import { requireSession } from "@/server/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }

  switch (req.method) {
    case "GET": {
      return res.status(200).json(departmentRepo.list());
    }
    case "POST": {
      if (session.user.roleId !== "admin") {
        return res.status(403).json({ message: "دسترسی غیرمجاز" });
      }
      const { name, description } = req.body || {};
      if (!name) {
        return res.status(400).json({ message: "نام دپارتمان الزامی است." });
      }
      const dept = departmentRepo.create({ name, description });
      return res.status(201).json(dept);
    }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
