import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import ticketService, { TicketWithRelations } from "@/services/ticketService";
import userService, { User } from "@/services/userService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ManagerDashboard() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ open: 0, closed: 0, inProgress: 0 });
  const [agents, setAgents] = useState<User[]>([]);
  const [agentStats, setAgentStats] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");

  // هشدار تکمیل پروفایل
  const isProfileIncomplete = !userProfile?.firstName || !userProfile?.lastName || !userProfile?.email;

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const res = await ticketService.getTickets({ departmentId: userProfile?.departmentId || undefined, searchTerm: search });
        setTickets(res.tickets || []);
        const open = res.tickets.filter(t => t.status?.name === "open").length;
        const closed = res.tickets.filter(t => t.status?.name === "closed").length;
        const inProgress = res.tickets.filter(t => t.status?.name === "in_progress").length;
        setStats({ open, closed, inProgress });
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    if (userProfile) fetchTickets();
  }, [userProfile, search]);

  useEffect(() => {
    async function fetchAgents() {
      if (!userProfile?.departmentId) return;
      const users = await userService.getUsersByDepartment(userProfile.departmentId);
      setAgents(users);
      // آمار تعداد تیکت‌های هر کارشناس
      const stats: Record<string, number> = {};
      users.forEach(u => {
        stats[u.id] = tickets.filter(t => t.assigneeId === u.id).length;
      });
      setAgentStats(stats);
    }
    fetchAgents();
  }, [userProfile, tickets]);

  // فیلتر و مرتب‌سازی تیکت‌ها
  let filteredTickets = tickets;
  if (statusFilter) filteredTickets = filteredTickets.filter(t => t.status?.name === statusFilter);
  if (sort === "newest") filteredTickets = filteredTickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  if (sort === "oldest") filteredTickets = filteredTickets.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

  // تعداد تیکت‌های حل‌نشده
  const unresolvedCount = tickets.filter(t => t.status?.name !== "closed").length;

  // داده‌های نمودار وضعیت تیکت‌ها
  const chartData = {
    labels: ["باز", "در حال بررسی", "بسته شده"],
    datasets: [
      {
        data: [stats.open, stats.inProgress, stats.closed],
        backgroundColor: ["#3b82f6", "#facc15", "#6b7280"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* هشدار تکمیل پروفایل */}
        {isProfileIncomplete && (
          <Card className="border-red-400 border-2">
            <CardContent className="text-red-600 py-4">
              لطفاً پروفایل خود را تکمیل کنید تا دسترسی کامل داشته باشید.
            </CardContent>
          </Card>
        )}
        {/* پیام خوش‌آمدگویی و پروفایل */}
        <Card>
          <CardHeader>
            <CardTitle>خوش آمدید {userProfile?.firstName} {userProfile?.lastName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">شما به عنوان مدیر وارد شده‌اید.</span>
              <NotificationDropdown />
            </div>
          </CardContent>
        </Card>
        {/* دسترسی سریع به پایگاه دانش */}
        <div className="flex gap-4">
          <Link href="/knowledge-base" className="text-blue-600 underline text-sm">دسترسی سریع به پایگاه دانش</Link>
        </div>
        {/* خلاصه وضعیت تیکت‌ها و نمودار */}
        <div className="flex gap-4 flex-wrap items-center">
          <Card className="flex-1 min-w-[150px]">
            <CardHeader>
              <CardTitle>تیکت‌های باز</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-blue-600">{stats.open}</Badge>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[150px]">
            <CardHeader>
              <CardTitle>در حال بررسی</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-yellow-600">{stats.inProgress}</Badge>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[150px]">
            <CardHeader>
              <CardTitle>بسته شده</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-gray-600">{stats.closed}</Badge>
            </CardContent>
          </Card>
          <Card className="min-w-[200px] flex items-center justify-center">
            <CardContent>
              <Pie data={chartData} width={120} height={120} options={{ plugins: { legend: { display: false } } }} />
            </CardContent>
          </Card>
        </div>
        {/* فیلتر و مرتب‌سازی */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={() => router.push("/tickets/new")}>ثبت تیکت جدید</Button>
          <Input
            placeholder="جستجو در تیکت‌های دپارتمان..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="همه وضعیت‌ها" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">همه</SelectItem>
              <SelectItem value="open">باز</SelectItem>
              <SelectItem value="in_progress">در حال بررسی</SelectItem>
              <SelectItem value="closed">بسته شده</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="مرتب‌سازی" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* نمایش تعداد تیکت‌های حل‌نشده */}
        <div className="text-sm text-yellow-700">تعداد تیکت‌های حل‌نشده: {unresolvedCount}</div>
        {/* لیست آخرین تیکت‌های دپارتمان */}
        <Card>
          <CardHeader>
            <CardTitle>آخرین تیکت‌های دپارتمان</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>در حال بارگذاری...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-sm text-muted-foreground">تیکتی ثبت نشده است.</div>
            ) : (
              <ul className="divide-y">
                {filteredTickets.slice(0, 5).map(ticket => (
                  <li key={ticket.id} className="py-2 flex items-center justify-between cursor-pointer hover:bg-muted/30 rounded px-2"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}>
                    <div>
                      <span className="font-medium">{ticket.title}</span>
                      <span className="text-xs text-gray-400 ml-2">{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString("fa-IR") : ""}</span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {ticket.status?.name === "open" ? "باز" : ticket.status?.name === "in_progress" ? "در حال بررسی" : ticket.status?.name === "closed" ? "بسته شده" : ticket.status?.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {/* آمار عملکرد کارشناسان */}
        <Card>
          <CardHeader>
            <CardTitle>آمار عملکرد کارشناسان</CardTitle>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div className="text-sm text-muted-foreground">کارشناسی یافت نشد.</div>
            ) : (
              <ul className="divide-y">
                {agents.map(agent => (
                  <li key={agent.id} className="py-2 flex items-center justify-between px-2">
                    <span>{agent.first_name} {agent.last_name}</span>
                    <Badge variant="outline" className="ml-2">{agentStats[agent.id] || 0} تیکت</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
