import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import ticketService from "@/services/ticketService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Ticket, AlertCircle, Clock, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    waiting: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getDashboardStats()
      .then((d) => {
        setStats({
          total: d.totalTickets || 0,
          open: d.openTickets || 0,
          inProgress: d.inProgressTickets || 0,
          waiting: d.waitingTickets || 0,
          closed: d.closedTickets || 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "کل تیکت‌ها",
      value: stats.total,
      icon: Ticket,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "باز",
      value: stats.open,
      icon: AlertCircle,
      color: "from-rose-500 to-red-600",
    },
    {
      title: "در حال بررسی",
      value: stats.inProgress,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "در انتظار",
      value: stats.waiting,
      icon: Clock,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "بسته / حل‌شده",
      value: stats.closed,
      icon: CheckCircle,
      color: "from-emerald-500 to-green-600",
    },
  ];

  const max = Math.max(stats.open, stats.inProgress, stats.waiting, stats.closed, 1);

  return (
    <MainLayout>
      <Head>
        <title>گزارش‌ها | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-lg">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">گزارش‌ها و آمار</h1>
            <p className="text-sm text-muted-foreground">
              نمای کلی عملکرد سامانه تیکتینگ
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map((c) => (
                <Card key={c.title} className="rounded-2xl">
                  <CardContent className="space-y-3 p-5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow`}
                    >
                      <c.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{c.title}</p>
                    <p className="text-3xl font-bold">{c.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>توزیع وضعیت تیکت‌ها</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "باز", value: stats.open, color: "bg-rose-500" },
                  {
                    label: "در حال بررسی",
                    value: stats.inProgress,
                    color: "bg-amber-500",
                  },
                  { label: "در انتظار", value: stats.waiting, color: "bg-yellow-500" },
                  { label: "بسته", value: stats.closed, color: "bg-emerald-500" },
                ].map((row) => (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${row.color} transition-all`}
                        style={{ width: `${(row.value / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
