import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("SecurePassword123!");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, refreshAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطا",
        description: "لطفاً ایمیل و رمز عبور را وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn({ email, password });
      
      // Get the redirect URL from query params or use default
      const redirectTo = router.query.redirect as string || "/dashboard";
      router.push(redirectTo);
      
      toast({
        title: "ورود موفق",
        description: "به سیستم تیکتینگ خوش آمدید",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "خطا در ورود",
        description: error.message || "مشکلی در ورود به سیستم رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Development helper function to skip login
  const handleAutoLogin = async () => {
    setIsLoading(true);
    try {
      // Directly refresh auth to create a mock user
      await refreshAuth();
      toast({
        title: "ورود خودکار",
        description: "حالت توسعه: حساب کاربری آزمایشی ساخته شد",
        variant: "default",
      });
      
      // Get the redirect URL from query params or use default
      const redirectTo = router.query.redirect as string || "/dashboard";
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Auto login error:", error);
      toast({
        title: "خطا در ورود خودکار",
        description: "مشکلی در ساخت حساب کاربری آزمایشی رخ داد.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ورود به سیستم مدیریت تیکت‌های سازمانی</title>
        <meta name="description" content="صفحه ورود به سیستم مدیریت تیکت‌های سازمانی" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-background p-4 rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">سیستم مدیریت تیکت‌های سازمانی</h1>
            <p className="text-muted-foreground mt-2">راهکار ارتباطی یکپارچه میان کارکنان شعب و دپارتمان‌های دفتر مرکزی</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>ورود به سیستم</CardTitle>
              <CardDescription>
                برای دسترسی به پنل کاربری خود وارد شوید
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ایمیل خود را وارد کنید"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">رمز عبور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "در حال ورود..." : "ورود"}
                </Button>
              </CardFooter>
            </form>
          </Card>          <div className="flex flex-col gap-2 mt-4 text-center">
            <Link href="/auth/register" className="text-blue-600 hover:underline">ثبت نام</Link>
            <Link href="/auth/forgot" className="text-blue-600 hover:underline">فراموشی رمز عبور</Link>
            <button
              onClick={handleAutoLogin}
              type="button"
              className="mt-2 text-gray-600 hover:text-gray-800 underline text-sm"
            >
              ورود خودکار (حالت توسعه)
            </button>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} - تمامی حقوق محفوظ است - سیستم مدیریت تیکت‌های سازمانی</p>
          </div>
        </div>
      </div>
    </>
  );
}
