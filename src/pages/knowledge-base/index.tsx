import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import knowledgeBaseService from "@/services/knowledgeBaseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Search, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function KnowledgeBaseIndexPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (q?: string) => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.getArticles(q);
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>پایگاه دانش | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">پایگاه دانش</h1>
              <p className="text-sm text-muted-foreground">
                مقالات راهنما و عیب‌یابی
              </p>
            </div>
          </div>
          <Button
            className="gap-2 rounded-xl"
            onClick={() => router.push("/knowledge-base/new")}
          >
            <Plus className="h-4 w-4" />
            مقاله جدید
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="rounded-xl pr-10"
              placeholder="جستجو در مقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load(search)}
            />
          </div>
          <Button variant="secondary" className="rounded-xl" onClick={() => load(search)}>
            جستجو
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <Card
                key={a.id}
                className="cursor-pointer rounded-2xl transition hover:border-primary/30 hover:shadow-md"
                onClick={() => router.push(`/knowledge-base/${a.id}`)}
              >
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug">{a.title}</h3>
                    <Badge variant="secondary" className="shrink-0 rounded-full">
                      {a.categoryName}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {a.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {a.views}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
