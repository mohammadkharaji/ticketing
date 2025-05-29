import React, { useEffect, useState } from "react";
import knowledgeBaseService from "@/services/knowledgeBaseService";
import ArticleList from "@/components/knowledge-base/ArticleList";
import Link from "next/link";

export default function KnowledgeBaseIndexPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const data = await knowledgeBaseService.getArticles();
      setArticles(data);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">مقالات دانش</h1>
        <Link href="/knowledge-base/new" className="btn btn-primary">افزودن مقاله جدید</Link>
      </div>
      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : (
        <ArticleList articles={articles} />
      )}
    </div>
  );
}
