import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "خطا",
        description: "لطفاً ایمیل خود را وارد کنید.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    // ارسال درخواست به سرور برای ثبت ایمیل
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <>
      <Head>
        <title>ثبت نام</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 rtl">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>ثبت نام</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center text-green-700 font-bold">
                  به زودی سایت دسترسی ایجاد و به همراه رمز عبور برای شما ارسال می‌گردد.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ایمیل خود را وارد کنید"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">ثبت نام</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
