import React, { useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function SecuritySettingsPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "رمز باید حداقل ۸ کاراکتر باشد", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "تکرار رمز مطابقت ندارد", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: password }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "درخواست به‌روزرسانی رمز ارسال شد" });
      setPassword("");
      setConfirm("");
    } catch {
      toast({
        title: "این قابلیت در حالت توسعه محدود است",
        description: "API به‌روزرسانی رمز را بعداً کامل کنید",
      });
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>امنیت | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">امنیت حساب</h1>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>تغییر رمز عبور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>رمز جدید</Label>
                <Input
                  type="password"
                  className="rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>تکرار رمز</Label>
                <Input
                  type="password"
                  className="rounded-xl"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-xl">
                ذخیره
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
