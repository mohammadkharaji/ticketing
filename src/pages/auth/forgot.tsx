import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "خطا",
        description: "لطفاً ایمیل خود را وارد کنید.",
        variant: "destructive",
      });
      return;
    }
    // Call API to request password reset
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("ارسال ایمیل با خطا مواجه شد.");
      setSubmitted(true);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "مشکلی رخ داد.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Head>
        <title>فراموشی رمز عبور</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 rtl">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>فراموشی رمز عبور</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center text-green-700 font-bold">
                  اگر ایمیل وارد شده معتبر باشد، لینک بازیابی رمز عبور برای شما ارسال خواهد شد.
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
                  <Button type="submit" className="w-full">ارسال لینک بازیابی</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
