import React from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Settings, User, Shield, Bell, Moon, Sun } from "lucide-react";

const items = [
  {
    href: "/settings/profile",
    title: "پروفایل",
    desc: "نام، ایمیل و اطلاعات شخصی",
    icon: User,
    color: "from-blue-500 to-indigo-600",
  },
  {
    href: "/settings/security",
    title: "امنیت",
    desc: "رمز عبور و امنیت حساب",
    icon: Shield,
    color: "from-slate-600 to-zinc-800",
  },
  {
    href: "/settings/notifications",
    title: "اعلان‌ها",
    desc: "ترجیحات اطلاع‌رسانی",
    icon: Bell,
    color: "from-rose-500 to-pink-600",
  },
];

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <MainLayout>
      <Head>
        <title>تنظیمات | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-500 to-zinc-700 text-white shadow-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">تنظیمات</h1>
            <p className="text-sm text-muted-foreground">مدیریت حساب و ظاهر سامانه</p>
          </div>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <p className="font-medium">حالت تاریک / روشن</p>
                <p className="text-xs text-muted-foreground">
                  فعلی: {isDark ? "تاریک" : "روشن"}
                </p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={toggleTheme}>
              تغییر تم
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="rounded-2xl transition hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
