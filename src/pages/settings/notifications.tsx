import React, { useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function NotificationSettingsPage() {
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(false);
  const [ticketUpdates, setTicketUpdates] = useState(true);

  const save = () => {
    localStorage.setItem(
      "notif-prefs",
      JSON.stringify({ inApp, email, ticketUpdates })
    );
    toast({ title: "ترجیحات ذخیره شد" });
  };

  return (
    <MainLayout>
      <Head>
        <title>تنظیمات اعلان | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">ترجیحات اعلان</h1>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>کانال‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="inApp">اعلان درون‌سامانه</Label>
              <Switch id="inApp" checked={inApp} onCheckedChange={setInApp} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">ایمیل</Label>
              <Switch id="email" checked={email} onCheckedChange={setEmail} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tickets">تغییر وضعیت تیکت</Label>
              <Switch
                id="tickets"
                checked={ticketUpdates}
                onCheckedChange={setTicketUpdates}
              />
            </div>
            <button
              type="button"
              onClick={save}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              ذخیره
            </button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
