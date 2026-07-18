import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function PendingRegistrationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/pending-registrations", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : data.items || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>ثبت‌نام‌های معلق | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ثبت‌نام‌های در انتظار تأیید</h1>
            <p className="text-sm text-muted-foreground">{items.length} مورد</p>
          </div>
        </div>
        {items.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-16 text-center text-muted-foreground">
              درخواست معلقی وجود ندارد
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item: any, i: number) => (
              <Card key={item.id || i} className="rounded-2xl">
                <CardContent className="p-4 text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
