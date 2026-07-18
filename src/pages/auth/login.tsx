import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Lock,
  Mail,
  Ticket,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

const LoginScene3D = dynamic(() => import("@/components/auth/LoginScene3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 bg-[#05080f]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.18),transparent_55%)]" />
      <div className="absolute left-1/2 top-[42%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-600/40 border-t-slate-300/80 animate-spin" />
      <p className="absolute left-1/2 top-[52%] -translate-x-1/2 text-[11px] tracking-[0.2em] text-slate-500 uppercase">
        Loading
      </p>
    </div>
  ),
});

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("SecurePassword123!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const goAfterLogin = () => {
    const redirectTo = (router.query.redirect as string) || "/dashboard";
    window.location.href = redirectTo;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "اطلاعات ناقص",
        description: "ایمیل و رمز عبور را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      toast({
        title: "ورود موفق",
        description: "در حال انتقال به پنل...",
      });
      goAfterLogin();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "ورود ناموفق",
        description: error?.message || "ایمیل یا رمز عبور نادرست است",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAutoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn({
        email: "admin@example.com",
        password: "SecurePassword123!",
      });
      toast({ title: "ورود آزمایشی", description: "حساب مدیر" });
      goAfterLogin();
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message || "ورود آزمایشی ناموفق بود",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ورود امن | تیکت‌یار</title>
        <meta
          name="description"
          content="ورود امن به سامانه مدیریت تیکت‌های سازمانی تیکت‌یار"
        />
      </Head>

      <div
        className="relative min-h-screen overflow-hidden bg-[#05080f] text-slate-100 selection:bg-blue-500/30"
        dir="rtl"
      >
        <Suspense fallback={<div className="absolute inset-0 bg-[#05080f]" />}>
          <LoginScene3D />
        </Suspense>

        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between px-5 py-4 md:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900 shadow-lg shadow-black/40">
                <Ticket className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-wide text-white">تیکت‌یار</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Enterprise Platform
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/90" />
              <span>اتصال امن · TLS</span>
            </div>
          </header>

          {/* Main */}
          <main className="flex flex-1 items-center px-4 pb-10 pt-2 md:px-10">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* Brand / value prop */}
              <section className="hidden lg:block">
                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Organizational Service Desk
                </p>
                <h1 className="max-w-lg text-4xl font-semibold leading-[1.25] tracking-tight text-white xl:text-[2.75rem]">
                  مدیریت یکپارچه درخواست‌ها
                  <span className="mt-1 block bg-gradient-to-l from-slate-100 via-blue-100 to-slate-400 bg-clip-text text-transparent">
                    برای شعب و دفتر مرکزی
                  </span>
                </h1>
                <p className="mt-5 max-w-md text-[15px] leading-8 text-slate-400">
                  ثبت، ارجاع و پیگیری تیکت‌ها در یک بستر واحد — با کنترل دسترسی مبتنی بر
                  نقش، گزارش‌گیری و پایگاه دانش سازمانی.
                </p>

                <ul className="mt-8 space-y-3">
                  {[
                    "کنترل دسترسی نقش‌محور (RBAC)",
                    "کد پیگیری یکتا برای هر تیکت",
                    "داشبورد مدیریتی و گزارش عملکرد",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400/90" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex items-center gap-6 border-t border-white/[0.06] pt-6">
                  {[
                    { icon: Building2, label: "شعب سازمانی" },
                    { icon: ShieldCheck, label: "امنیت سازمانی" },
                    { icon: Ticket, label: "SLA & پیگیری" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                  ))}
                </div>
              </section>

              {/* Auth card */}
              <section className="mx-auto w-full max-w-[420px]">
                {/* mobile brand */}
                <div className="mb-6 lg:hidden">
                  <h1 className="text-xl font-semibold text-white">ورود به سامانه</h1>
                  <p className="mt-1 text-sm text-slate-400">تیکت‌یار · سرویس سازمانی</p>
                </div>

                <div
                  className={`relative overflow-hidden rounded-2xl border bg-[#0b1220]/75 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition-shadow duration-300 ${
                    focused
                      ? "border-blue-400/25 shadow-blue-950/40"
                      : "border-white/[0.08]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent" />
                  <div className="pointer-events-none absolute -left-24 top-0 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />

                  <div className="relative p-7 sm:p-8">
                    <div className="mb-7">
                      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                        Sign in
                      </p>
                      <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white">
                        ورود به حساب کاربری
                      </h2>
                      <p className="mt-1.5 text-[13px] leading-6 text-slate-400">
                        از ایمیل سازمانی و رمز عبور خود استفاده کنید.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-[12px] font-medium text-slate-300"
                        >
                          ایمیل سازمانی
                        </Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="email"
                            type="email"
                            className="h-11 rounded-lg border-white/[0.08] bg-white/[0.03] pr-10 text-[14px] text-white placeholder:text-slate-600 focus-visible:border-blue-500/40 focus-visible:ring-1 focus-visible:ring-blue-500/30"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                            disabled={isLoading}
                            autoComplete="username"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="password"
                            className="text-[12px] font-medium text-slate-300"
                          >
                            رمز عبور
                          </Label>
                          <Link
                            href="/auth/forgot"
                            className="text-[11px] text-slate-500 transition hover:text-blue-300"
                          >
                            فراموشی رمز؟
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="h-11 rounded-lg border-white/[0.08] bg-white/[0.03] pr-10 pl-10 text-[14px] text-white placeholder:text-slate-600 focus-visible:border-blue-500/40 focus-visible:ring-1 focus-visible:ring-blue-500/30"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocused("password")}
                            onBlur={() => setFocused(null)}
                            disabled={isLoading}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 w-full rounded-lg bg-white text-[14px] font-semibold text-slate-900 shadow-lg shadow-black/30 transition hover:bg-slate-100"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-800" />
                            در حال احراز هویت...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            ورود به پنل
                            <ArrowLeft className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.06]" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                        <span className="bg-[#0b1220]/90 px-3 text-slate-600">یا</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleAutoLogin}
                      className="flex h-10 w-full items-center justify-center rounded-lg border border-white/[0.08] bg-transparent text-[12px] text-slate-400 transition hover:border-white/15 hover:bg-white/[0.03] hover:text-slate-200 disabled:opacity-50"
                    >
                      ورود آزمایشی (Demo Admin)
                    </button>

                    <p className="mt-6 text-center text-[12px] text-slate-500">
                      حساب ندارید؟{" "}
                      <Link
                        href="/auth/register"
                        className="font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
                      >
                        درخواست دسترسی
                      </Link>
                    </p>
                  </div>

                  <div className="border-t border-white/[0.05] bg-black/20 px-7 py-3 sm:px-8">
                    <p className="text-center text-[10px] leading-relaxed text-slate-600">
                      Demo ·{" "}
                      <span className="font-mono text-slate-500">admin@example.com</span>
                      {" · "}
                      <span className="font-mono text-slate-500">SecurePassword123!</span>
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-center text-[10px] leading-5 text-slate-600">
                  © {new Date().getFullYear()} تیکت‌یار · تمامی حقوق محفوظ است
                  <br />
                  <span className="text-slate-700">
                    با ورود، شرایط استفاده از سامانه را می‌پذیرید
                  </span>
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
