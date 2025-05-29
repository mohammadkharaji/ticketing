import React, { useState } from "react";
import knowledgeBaseService from "@/services/knowledgeBaseService";
import ArticleForm from "@/components/knowledge-base/ArticleForm";
import { useRouter } from "next/router";

export default function KnowledgeBaseNewPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    await knowledgeBaseService.createArticle(data);
    setLoading(false);
    router.push("/knowledge-base");
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">افزودن مقاله جدید</h1>
      <ArticleForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
