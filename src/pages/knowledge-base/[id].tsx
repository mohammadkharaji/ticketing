import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import knowledgeBaseService from "@/services/knowledgeBaseService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Eye } from "lucide-react";

export default function KnowledgeBaseArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    knowledgeBaseService
      .getArticle(id)
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <MainLayout>
      <Head>
        <title>{article?.title || "مقاله"} | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-3xl space-y-6">
        <Button
          variant="ghost"
          className="gap-2 rounded-xl"
          onClick={() => router.push("/knowledge-base")}
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Button>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !article ? (
          <p>مقاله یافت نشد</p>
        ) : (
          <Card className="rounded-2xl">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full">{article.categoryName}</Badge>
                {(article.tags || []).map((t: string) => (
                  <Badge key={t} variant="outline" className="rounded-full">
                    {t}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{article.authorName}</span>
                <span>·</span>
                <span>
                  {new Date(article.updatedAt).toLocaleDateString("fa-IR")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {article.views}
                </span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-8 text-foreground/90">
                {article.content}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
