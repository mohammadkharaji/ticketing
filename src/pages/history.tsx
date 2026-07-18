import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import ticketService, { TicketWithRelations } from "@/services/ticketService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getTickets({ pageSize: 100 })
      .then(({ tickets }) => {
        const sorted = [...tickets].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setTickets(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>تاریخچه | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500 to-zinc-700 text-white shadow-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">تاریخچه فعالیت‌ها</h1>
            <p className="text-sm text-muted-foreground">
              آخرین به‌روزرسانی‌های تیکت‌ها
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="relative space-y-0 border-r-2 border-primary/20 pr-6 mr-3">
            {tickets.map((t, i) => (
              <div key={t.id} className="relative pb-6">
                <span className="absolute -right-[1.9rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary shadow" />
                <Card
                  className="cursor-pointer rounded-2xl transition hover:shadow-md"
                  onClick={() => router.push(`/tickets/${t.id}`)}
                >
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">
                        #{t.ticketNumber} ·{" "}
                        {new Date(t.updatedAt).toLocaleString("fa-IR")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {t.status?.name || t.statusId}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
