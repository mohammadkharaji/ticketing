import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import ticketService, { TicketWithRelations } from "@/services/ticketService";
import { formatPersianDate, formatPersianRelativeTime } from "@/lib/date-utils"; // مسیر صحیح

export default function TicketsPage() {
  const { userProfile, isAdmin, isDepartmentManager, isBranchManager } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [ticketNumberSearch, setTicketNumberSearch] = useState(""); // گزینه 3
  const pageSize = 10;

  useEffect(() => {
    if (!userProfile) return;

    const fetchTickets = async () => {
      try {
        const filters: any = {
          page: currentPage,
          pageSize,
          searchTerm,
        };

        if (statusFilter) filters.statusId = statusFilter;
        if (priorityFilter) filters.priorityId = priorityFilter;
        // جستجو بر اساس کد تیکت
        if (ticketNumberSearch) filters.ticketNumber = ticketNumberSearch;

        // فیلتر بر اساس نقش کاربر
        if (!isAdmin && !isDepartmentManager && !isBranchManager) {
          // کاربر عادی فقط تیکت‌های خودش را می‌بیند
          filters.userId = userProfile.id;
        } else if (isDepartmentManager) {
          // مدیر دپارتمان تیکت‌های دپارتمان خود را می‌بیند
          filters.departmentId = userProfile.departmentId;
        } else if (isBranchManager) {
          // مدیر شعبه تیکت‌های شعبه خود را می‌بیند
          filters.branchId = userProfile.branchId;
        }

        const { tickets, count } = await ticketService.getTickets(filters);
        setTickets(tickets);
        setTotalCount(count);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [userProfile, currentPage, searchTerm, statusFilter, priorityFilter, ticketNumberSearch, isAdmin, isDepartmentManager, isBranchManager]);

  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case "open":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "waiting":
        return "text-yellow-600";
      case "closed":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priorityId: string) => {
    switch (priorityId) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">تیکت‌ها</h1>
          <Button onClick={() => router.push('/tickets/new')} className="flex items-center">
            <span className="flex items-center">
              <Plus className="ml-2 h-4 w-4" />
              تیکت جدید
            </span>
          </Button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          {/* گزینه 3: جستجو بر اساس کد تیکت */}
          <div className="min-w-[180px]">
            <Input
              placeholder="کد تیکت (مثال: 2184020101)"
              value={ticketNumberSearch}
              onChange={e => setTicketNumberSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="open">باز</SelectItem>
              <SelectItem value="in_progress">در حال بررسی</SelectItem>
              <SelectItem value="waiting">در انتظار پاسخ</SelectItem>
              <SelectItem value="closed">بسته شده</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="اولویت" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="high">بالا</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="low">پایین</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`} legacyBehavior passHref>
              <div>
                <Card className="hover:bg-accent/5 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                      <span>#{ticket.ticketNumber} - {ticket.title}</span>
                      <div className="flex gap-2 text-sm">
                        <span className={getStatusColor(ticket.statusId)}>
                          {ticket.status?.name}
                        </span>
                        <span className={getPriorityColor(ticket.priorityId)}>
                          {ticket.priority?.name}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>دپارتمان: {ticket.department?.name}</span>
                        <span>ایجاد کننده: {ticket.creator?.firstName} {ticket.creator?.lastName}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>آخرین بروزرسانی: {formatPersianRelativeTime(ticket.updatedAt)}</span>
                        <span>ایجاد شده در: {formatPersianDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>

        {totalCount > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </MainLayout>
  );
}
