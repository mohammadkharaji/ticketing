import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function PendingRegistrationsPage() {
  const [pending, setPending] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pending-registrations")
      .then(res => res.json())
      .then(data => {
        setPending(data.pending || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>ثبت‌نام‌های جدید</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 rtl">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>ثبت‌نام‌های جدید</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>در حال بارگذاری...</div>
              ) : pending.length === 0 ? (
                <div className="text-center text-muted-foreground">در حال حاضر ثبت‌نام جدیدی وجود ندارد.</div>
              ) : (
                <ul className="space-y-2">
                  {pending.map(email => (
                    <li key={email} className="flex items-center justify-between border-b py-2">
                      <span>{email}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await fetch("/api/admin/remove-pending-registration", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                          });
                          setPending(pending.filter(e => e !== email));
                        }}
                      >
                        حذف
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
