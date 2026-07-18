import React from "react";
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Ticket, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Filter, 
  Search, 
  RefreshCw,
  FileText,
  Calendar,
  BarChart4,
  MoreHorizontal,
  Users,
  HelpCircle,
  ChevronRight,
  ArrowUpRight,
  ListFilter,
  CalendarDays,
  Settings,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MainLayout from "@/components/layouts/MainLayout";

export default function DashboardPage() {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const profile = userProfile;
  const isLoading = loading;
  const router = useRouter();
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("my-tickets");
  const [period, setPeriod] = useState("weekly");
  const [recentTickets, setRecentTickets] = useState<
    Array<{
      id: string;
      title: string;
      status: string;
      date: string;
      department: string;
      priority: string;
    }>
  >([]);

  const fetchTicketStats = useCallback(async () => {
    if (!user) return;
    setIsLoadingStats(true);
    try {
      const ticketService = (await import("@/services/ticketService")).default;
      const data = await ticketService.getDashboardStats();
      setTicketStats({
        total: data.totalTickets ?? 0,
        open: data.openTickets ?? 0,
        inProgress: data.inProgressTickets ?? 0,
        closed: data.closedTickets ?? 0,
      });
      const recent = (data.recentTickets || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.statusId || t.status?.id || "open",
        date: t.createdAt
          ? new Date(t.createdAt).toLocaleDateString("fa-IR")
          : "—",
        department: t.department?.name || t.departmentId || "—",
        priority: t.priorityId || t.priority?.id || "medium",
      }));
      setRecentTickets(recent);
    } catch (error) {
      console.error("Error fetching ticket stats:", error);
      setTicketStats({ total: 0, open: 0, inProgress: 0, closed: 0 });
      setRecentTickets([]);
    } finally {
      setIsLoadingStats(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTicketStats();
    }
  }, [user, fetchTicketStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTicketStats();
    setIsRefreshing(false);
  };

  const upcomingEvents = [
    { id: 1, title: "جلسه بررسی پروژه‌ها", date: "1402/02/18", time: "10:00" },
    { id: 2, title: "آپدیت سیستم", date: "1402/02/20", time: "09:00" },
    { id: 3, title: "آموزش کاربران جدید", date: "1402/02/25", time: "14:00" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "text-destructive bg-destructive/10 border-destructive/20";
      case "in_progress": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "closed": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>داشبورد | سیستم مدیریت تیکت‌های سازمانی</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">داشبورد</h1>
            <p className="text-muted-foreground mt-1">خلاصه وضعیت تیکت‌ها و فعالیت‌های سیستم</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select defaultValue={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="بازه زمانی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">روزانه</SelectItem>
                <SelectItem value="weekly">هفتگی</SelectItem>
                <SelectItem value="monthly">ماهانه</SelectItem>
                <SelectItem value="yearly">سالانه</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>بروزرسانی</span>
            </Button>
            
            <Button 
              onClick={() => router.push("/tickets/new")}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4 ml-1" />
              <span>تیکت جدید</span>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Ticket className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
                ) : (
                  ticketStats.total
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{4} نسبت به {period === "daily" ? "دیروز" : period === "weekly" ? "هفته قبل" : period === "monthly" ? "ماه قبل" : "سال قبل"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">تیکت‌های باز</CardTitle>
              <div className="h-8 w-8 bg-destructive/10 rounded-full flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  ticketStats.open
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{2} نسبت به {period === "daily" ? "دیروز" : period === "weekly" ? "هفته قبل" : period === "monthly" ? "ماه قبل" : "سال قبل"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">در حال بررسی</CardTitle>
              <div className="h-8 w-8 bg-yellow-500/10 rounded-full flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  ticketStats.inProgress
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{1} نسبت به {period === "daily" ? "دیروز" : period === "weekly" ? "هفته قبل" : period === "monthly" ? "ماه قبل" : "سال قبل"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">تیکت‌های بسته شده</CardTitle>
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  ticketStats.closed
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{3} نسبت به {period === "daily" ? "دیروز" : period === "weekly" ? "هفته قبل" : period === "monthly" ? "ماه قبل" : "سال قبل"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* تیکت‌های اخیر */}
          <Card className="md:col-span-2 shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">تیکت‌های اخیر</CardTitle>                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                                      </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex gap-2 items-center">
                      <ListFilter className="h-4 w-4" /> فیلتر کردن
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2 items-center">
                      <RefreshCw className="h-4 w-4" /> بروزرسانی
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2 items-center" onClick={() => router.push("/tickets")}>
                      <ArrowUpRight className="h-4 w-4" /> مشاهده همه
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator className="my-1" />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[320px]">
                <div className="divide-y">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex flex-col p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{ticket.title}</h3>
                            <Badge variant="outline" className={`px-2 py-0 text-xs ${getStatusColor(ticket.status)}`}>
                              {ticket.status === "open" ? "باز" : 
                              ticket.status === "in_progress" ? "در حال بررسی" : 
                              "بسته شده"}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {ticket.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {ticket.department}
                            </span>
                            <span>•</span>
                            <span className={`flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
                              <AlertCircle className="h-3 w-3" />
                              {ticket.priority === "high" ? "بالا" : 
                               ticket.priority === "medium" ? "متوسط" : "پایین"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {recentTickets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Ticket className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">هیچ تیکتی یافت نشد</h3>
                  <p className="text-sm text-muted-foreground mb-4">تیکت‌های اخیر شما در اینجا نمایش داده خواهند شد.</p>
                  <Button size="sm" onClick={() => router.push("/tickets/new")}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    ایجاد تیکت جدید
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-center">
              <Button variant="ghost" className="w-full" onClick={() => router.push("/tickets")}>
                مشاهده همه تیکت‌ها
                <ArrowUpRight className="mr-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* رویدادهای آینده و دسترسی‌های سریع */}
          <div className="space-y-6">
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-xl">رویدادهای آینده</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.date} - ساعت {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-1 pb-4">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push("/calendar")}>
                  مشاهده تقویم
                  <Calendar className="mr-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-xl">دسترسی‌های سریع</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2" onClick={() => router.push("/tickets/new")}>
                    <PlusCircle className="h-5 w-5 text-primary" />
                    <span className="text-xs">تیکت جدید</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2" onClick={() => router.push("/reports")}>
                    <BarChart4 className="h-5 w-5 text-primary" />
                    <span className="text-xs">گزارش‌ها</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2" onClick={() => router.push("/knowledge-base")}>
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-xs">پایگاه دانش</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-4 gap-2" onClick={() => router.push("/help")}>
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="text-xs">راهنما</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>      </div>
      
      {/* Floating Action Button for quick actions */}
      <div className="fixed bottom-6 left-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all">
              <PlusCircle className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/tickets/new")}>
              <Ticket className="mr-2 h-4 w-4" />
              <span>تیکت جدید</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/knowledge-base/new")}>
              <FileText className="mr-2 h-4 w-4" />
              <span>مقاله جدید</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/chat")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>گفتگوی جدید</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </MainLayout>
  );
}
