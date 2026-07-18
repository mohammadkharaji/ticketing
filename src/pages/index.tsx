import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/dashboard" : "/auth/login");
  }, [loading, user, router]);

  return (
    <>
      <Head>
        <title>سیستم مدیریت تیکت‌های سازمانی</title>
        <meta
          name="description"
          content="راهکار ارتباطی یکپارچه میان کارکنان شعب و دپارتمان‌های دفتر مرکزی"
        />
      </Head>
      <main className="min-h-screen bg-background flex items-center justify-center rtl">
        <div className="text-center space-y-5 px-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
            ت
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            سیستم مدیریت تیکت‌های سازمانی
          </h1>
          <p className="text-muted-foreground">در حال انتقال به صفحه مناسب...</p>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </main>
    </>
  );
}
