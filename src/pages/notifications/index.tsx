import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Notif = {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notificationIds: [] }),
    });
    toast({ title: "همه اعلان‌ها خوانده شد" });
    load();
  };

  return (
    <MainLayout>
      <Head>
        <title>اعلان‌ها | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">اعلان‌ها</h1>
              <p className="text-sm text-muted-foreground">
                {items.filter((n) => !n.isRead).length} خوانده‌نشده
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            خواندن همه
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-16 text-center text-muted-foreground">
              اعلانی وجود ندارد
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <Card
                key={n.id}
                className={`cursor-pointer rounded-2xl transition hover:shadow-md ${
                  !n.isRead ? "border-primary/30 bg-primary/5" : ""
                }`}
                onClick={() => router.push(n.link || "/tickets")}
              >
                <CardContent className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-medium leading-relaxed">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString("fa-IR")}
                    </p>
                  </div>
                  {!n.isRead && (
                    <Badge className="rounded-full shrink-0">جدید</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
