import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import ticketService, { TicketWithRelations } from "@/services/ticketService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export default function ChatIndexPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getTickets({ pageSize: 30 })
      .then(({ tickets }) => setTickets(tickets.filter((t) => t.statusId !== "closed")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>گفتگو | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">گفتگوهای فعال</h1>
            <p className="text-sm text-muted-foreground">
              گفتگو روی تیکت‌های باز — برای چت کامل روی هر مورد کلیک کنید
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : tickets.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-16 text-center text-muted-foreground">
              گفتگوی فعالی وجود ندارد
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {tickets.map((t) => (
              <Card
                key={t.id}
                className="cursor-pointer rounded-2xl transition hover:border-primary/30 hover:shadow-md"
                onClick={() => router.push(`/tickets/${t.id}`)}
              >
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      #{t.ticketNumber} · {(t.replies || []).length} پیام
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full shrink-0">
                    {t.status?.name || t.statusId}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
