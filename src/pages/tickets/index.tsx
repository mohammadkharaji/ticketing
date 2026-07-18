import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import ticketService, { TicketWithRelations } from "@/services/ticketService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, RefreshCw, Ticket } from "lucide-react";

const statusLabel: Record<string, string> = {
  open: "باز",
  in_progress: "در حال بررسی",
  waiting: "در انتظار",
  closed: "بسته",
  resolved: "حل‌شده",
};

const priorityLabel: Record<string, string> = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
};

export default function TicketsPage() {
  const router = useRouter();
  const { userProfile, isAdmin, isDepartmentManager, isBranchManager } = useAuth();
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    (router.query.search as string) || ""
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const load = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const filters: any = {
        page: 1,
        pageSize: 50,
        searchTerm: searchTerm || undefined,
      };
      if (statusFilter !== "all") filters.statusId = statusFilter;
      if (priorityFilter !== "all") filters.priorityId = priorityFilter;
      if (!isAdmin && !isDepartmentManager && !isBranchManager) {
        filters.userId = userProfile.id;
      } else if (isDepartmentManager && userProfile.departmentId) {
        filters.departmentId = userProfile.departmentId;
      }

      const { tickets: list, count } = await ticketService.getTickets(filters);
      setTickets(list);
      setTotal(count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.search) setSearchTerm(String(router.query.search));
  }, [router.query.search]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, statusFilter, priorityFilter]);

  return (
    <MainLayout>
      <Head>
        <title>تیکت‌ها | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">تیکت‌ها</h1>
            <p className="text-sm text-muted-foreground">
              {total} تیکت · مدیریت و پیگیری درخواست‌ها
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={load} className="rounded-xl">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button className="rounded-xl gap-2" onClick={() => router.push("/tickets/new")}>
              <Plus className="h-4 w-4" />
              تیکت جدید
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="rounded-xl pr-10"
                placeholder="جستجو در عنوان، توضیحات یا کد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-xl md:w-40">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in_progress">در حال بررسی</SelectItem>
                <SelectItem value="waiting">در انتظار</SelectItem>
                <SelectItem value="closed">بسته</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full rounded-xl md:w-40">
                <SelectValue placeholder="اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">کم</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="rounded-xl" onClick={load}>
              اعمال
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : tickets.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Ticket className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">تیکتی یافت نشد</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  فیلتر را تغییر دهید یا تیکت جدید بسازید
                </p>
                <Button onClick={() => router.push("/tickets/new")} className="rounded-xl">
                  ایجاد تیکت
                </Button>
              </CardContent>
            </Card>
          ) : (
            tickets.map((t) => (
              <Card
                key={t.id}
                className="cursor-pointer rounded-2xl border-border/60 transition hover:border-primary/30 hover:shadow-md"
                onClick={() => router.push(`/tickets/${t.id}`)}
              >
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{t.ticketNumber}
                      </span>
                      <h3 className="truncate font-semibold">{t.title}</h3>
                    </div>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {t.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
                      <span>{t.department?.name || t.departmentId}</span>
                      <span>·</span>
                      <span>
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString("fa-IR")
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {statusLabel[t.statusId] || t.status?.name || t.statusId}
                    </Badge>
                    <Badge
                      className={`rounded-full ${
                        t.priorityId === "urgent" || t.priorityId === "high"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                      variant="secondary"
                    >
                      {priorityLabel[t.priorityId] || t.priorityId}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
