import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import knowledgeBaseService from "@/services/knowledgeBaseService";
import ArticleDetail from "@/components/knowledge-base/ArticleDetail";

export default function KnowledgeBaseArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    async function fetchArticle() {
      setLoading(true);
      const data = await knowledgeBaseService.getArticleById(id as string);
      setArticle(data);
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!article) return <div>مقاله‌ای یافت نشد.</div>;

  return <ArticleDetail article={article} />;
}
