import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import ticketService from "@/services/ticketService";
import departmentService from "@/services/departmentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Send } from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priorityId, setPriorityId] = useState("medium");
  const [departmentId, setDepartmentId] = useState("");
  const [branchId, setBranchId] = useState("211");
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    departmentService.getDepartments().then((list) => {
      setDepartments(list);
      if (list[0] && !departmentId) setDepartmentId(list[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        title: "اطلاعات ناقص",
        description: "عنوان و توضیحات الزامی است",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const ticket = await ticketService.createTicket({
        title: title.trim(),
        description: description.trim(),
        priorityId,
        departmentId: departmentId || "support",
        categoryId: "general",
        statusId: "open",
        branchId,
        creatorId: user?.id || userProfile?.id,
      });
      toast({
        title: "تیکت ثبت شد ✨",
        description: `کد پیگیری: ${ticket?.ticketNumber}`,
      });
      router.push(ticket?.id ? `/tickets/${ticket.id}` : "/tickets");
    } catch (err: any) {
      toast({
        title: "خطا",
        description: err?.message || "ثبت تیکت ناموفق بود",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>تیکت جدید | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => router.back()}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">ثبت تیکت جدید</h1>
            <p className="text-sm text-muted-foreground">
              درخواست خود را با جزئیات کامل ثبت کنید
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border-border/60 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>اطلاعات تیکت</CardTitle>
            <CardDescription>
              هرچه توضیحات دقیق‌تر باشد، پاسخ سریع‌تر خواهد بود
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  className="rounded-xl"
                  placeholder="مثال: مشکل اتصال به شبکه"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">توضیحات</Label>
                <Textarea
                  id="desc"
                  className="min-h-[140px] rounded-xl"
                  placeholder="شرح کامل مشکل یا درخواست..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>اولویت</Label>
                  <Select value={priorityId} onValueChange={setPriorityId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">کم</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                      <SelectItem value="urgent">فوری</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>دپارتمان</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="انتخاب دپارتمان" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>کد شعبه</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="211">تهران مرکز (211)</SelectItem>
                    <SelectItem value="301">مشهد (301)</SelectItem>
                    <SelectItem value="302">اصفهان (302)</SelectItem>
                    <SelectItem value="303">شیراز (303)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 gap-2 rounded-xl"
                  disabled={submitting}
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "در حال ثبت..." : "ثبت تیکت"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => router.push("/tickets")}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
