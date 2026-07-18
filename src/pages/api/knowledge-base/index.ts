import type { NextApiRequest, NextApiResponse } from "next";
import { kbRepo } from "@/server/kb-repo";
import { requireSession } from "@/server/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireSession(req);
  if ("error" in session) {
    return res.status(session.status).json({ message: session.error });
  }

  if (req.method === "GET") {
    const { id, search, categories } = req.query;
    if (categories === "1") {
      return res.status(200).json(kbRepo.categories());
    }
    if (typeof id === "string") {
      const article = kbRepo.get(id);
      if (!article) return res.status(404).json({ message: "مقاله یافت نشد" });
      return res.status(200).json(article);
    }
    const articles = kbRepo.list(typeof search === "string" ? search : undefined);
    return res.status(200).json({ articles, total: articles.length });
  }

  if (req.method === "POST") {
    const { title, summary, content, categoryId, categoryName, tags } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ message: "عنوان و محتوا الزامی است" });
    }
    const article = kbRepo.create({
      title,
      summary: summary || title,
      content,
      categoryId: categoryId || "guide",
      categoryName: categoryName || "راهنما",
      tags: tags || [],
      authorId: session.user.id,
      authorName: `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim() || "کاربر",
    });
    return res.status(201).json(article);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
