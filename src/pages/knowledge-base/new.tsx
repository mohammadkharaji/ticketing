import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import knowledgeBaseService from "@/services/knowledgeBaseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function NewKnowledgeArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "عنوان و محتوا الزامی است", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const article = await knowledgeBaseService.createArticle({
        title: title.trim(),
        summary: summary.trim() || title.trim(),
        content: content.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        categoryId: "guide",
        categoryName: "راهنما",
      });
      toast({ title: "مقاله منتشر شد" });
      router.push(`/knowledge-base/${article.id}`);
    } catch {
      toast({ title: "خطا در ثبت مقاله", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>مقاله جدید | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">مقاله جدید پایگاه دانش</h1>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>محتوا</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان</Label>
                <Input
                  className="rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>خلاصه</Label>
                <Input
                  className="rounded-xl"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>متن مقاله</Label>
                <Textarea
                  className="min-h-[200px] rounded-xl"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>برچسب‌ها (با ویرگول)</Label>
                <Input
                  className="rounded-xl"
                  placeholder="تیکت, راهنما"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-xl" disabled={saving}>
                {saving ? "در حال ذخیره..." : "انتشار"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
