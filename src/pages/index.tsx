import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "../contexts/AuthContext";
import { StaticRouter, Route, Routes } from "react-router-dom";
import ReportsPage from "./reports";
import HistoryPage from "./history";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [loading, user, router]);

  return (
    <StaticRouter location={"/"}>
      <>
        <Head>
          <title>سیستم مدیریت تیکت‌های سازمانی</title>
          <meta name="description" content="راهکار ارتباطی یکپارچه میان کارکنان شعب و دپارتمان‌های دفتر مرکزی" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="min-h-screen bg-background flex items-center justify-center rtl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">سیستم مدیریت تیکت‌های سازمانی</h1>
            <p className="text-lg text-muted-foreground">در حال انتقال به صفحه مناسب...</p>
            <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mx-auto"></div>
          </div>
        </main>

        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </>
    </StaticRouter>
  );
}
