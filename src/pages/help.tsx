import React from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, Ticket, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "چطور تیکت جدید ثبت کنم؟",
    a: "از منوی تیکت‌ها گزینه «تیکت جدید» را بزنید، عنوان و توضیحات را وارد کنید، دپارتمان و اولویت را مشخص کرده و ثبت کنید.",
  },
  {
    q: "کد پیگیری تیکت چیست؟",
    a: "پس از ثبت، یک کد عددی (شامل کد شعبه + تاریخ شمسی + ردیف روزانه) به تیکت اختصاص می‌یابد که برای پیگیری استفاده می‌شود.",
  },
  {
    q: "سطوح دسترسی کاربران چیست؟",
    a: "کاربر عادی فقط تیکت‌های خود را می‌بیند. کارشناس و مدیران دپارتمان/شعبه تیکت‌های مرتبط را مدیریت می‌کنند. مدیر سیستم دسترسی کامل دارد.",
  },
  {
    q: "چطور رمز عبورم را عوض کنم؟",
    a: "از مسیر تنظیمات → امنیت می‌توانید رمز عبور را تغییر دهید. در صورت فراموشی، از صفحه ورود گزینه فراموشی رمز را استفاده کنید.",
  },
  {
    q: "اعلان‌ها چگونه کار می‌کنند؟",
    a: "با ثبت تیکت، پاسخ جدید و تغییر وضعیت، اعلان درون‌سامانه‌ای برای ذینفعان ایجاد می‌شود. از آیکون زنگوله در هدر قابل مشاهده است.",
  },
];

export default function HelpPage() {
  return (
    <MainLayout>
      <Head>
        <title>راهنما | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-500 to-green-600 text-white shadow-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">مرکز راهنما</h1>
            <p className="text-sm text-muted-foreground">
              پاسخ سوالات رایج و لینک‌های مفید
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "پایگاه دانش",
              href: "/knowledge-base",
              icon: BookOpen,
              color: "from-amber-500 to-orange-600",
            },
            {
              title: "تیکت جدید",
              href: "/tickets/new",
              icon: Ticket,
              color: "from-violet-500 to-purple-600",
            },
            {
              title: "امنیت حساب",
              href: "/settings/security",
              icon: Shield,
              color: "from-slate-600 to-zinc-800",
            },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full rounded-2xl transition hover:shadow-md hover:border-primary/30">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>سوالات متداول</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-right">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">هنوز پاسخ نگرفتید؟</p>
              <p className="text-sm text-muted-foreground">
                یک تیکت برای پشتیبانی ثبت کنید
              </p>
            </div>
            <Button asChild className="rounded-xl">
              <Link href="/tickets/new">ثبت تیکت پشتیبانی</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
