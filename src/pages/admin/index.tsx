import React from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Building2,
  Shield,
  UserPlus,
  Clock,
  LayoutDashboard,
  Ticket,
  BookOpen,
} from "lucide-react";

const links = [
  {
    href: "/admin/users",
    title: "کاربران",
    desc: "مدیریت حساب‌های کاربری",
    icon: Users,
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    href: "/admin/create-user",
    title: "ایجاد کاربر",
    desc: "ثبت کاربر جدید",
    icon: UserPlus,
    color: "from-violet-500 to-purple-600",
  },
  {
    href: "/admin/departments",
    title: "دپارتمان‌ها",
    desc: "ساختار سازمانی",
    icon: Building2,
    color: "from-cyan-500 to-sky-600",
  },
  {
    href: "/admin/branches",
    title: "شعب",
    desc: "مدیریت شعب",
    icon: Building2,
    color: "from-emerald-500 to-teal-600",
  },
  {
    href: "/admin/roles",
    title: "نقش‌ها",
    desc: "سطوح دسترسی",
    icon: Shield,
    color: "from-slate-600 to-zinc-800",
  },
  {
    href: "/admin/pending-registrations",
    title: "ثبت‌نام‌های معلق",
    desc: "تأیید درخواست‌ها",
    icon: Clock,
    color: "from-amber-500 to-orange-600",
  },
  {
    href: "/tickets",
    title: "تیکت‌ها",
    desc: "همه تیکت‌های سیستم",
    icon: Ticket,
    color: "from-blue-500 to-indigo-600",
  },
  {
    href: "/knowledge-base",
    title: "پایگاه دانش",
    desc: "مقالات راهنما",
    icon: BookOpen,
    color: "from-lime-500 to-green-600",
  },
];

export default function AdminDashboard() {
  return (
    <MainLayout>
      <Head>
        <title>پنل مدیریت | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">پنل مدیریت</h1>
            <p className="text-sm text-muted-foreground">
              کنترل کامل سامانه تیکتینگ
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full rounded-2xl border-border/60 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
                <CardContent className="space-y-3 p-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
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
