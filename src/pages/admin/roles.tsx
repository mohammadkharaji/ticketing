import React from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const roles = [
  {
    id: "admin",
    name: "مدیر سیستم",
    perms: ["همه تیکت‌ها", "کاربران", "تنظیمات", "گزارش‌ها", "حذف"],
  },
  {
    id: "department_manager",
    name: "مدیر دپارتمان",
    perms: ["تیکت دپارتمان", "ارجاع", "گزارش دپارتمان"],
  },
  {
    id: "branch_manager",
    name: "مدیر شعبه",
    perms: ["تیکت شعبه", "گزارش شعبه"],
  },
  {
    id: "support",
    name: "کارشناس",
    perms: ["پاسخ تیکت", "تغییر وضعیت", "پایگاه دانش"],
  },
  {
    id: "user",
    name: "کاربر",
    perms: ["ثبت تیکت", "مشاهده تیکت خود", "اعلان"],
  },
];

export default function AdminRolesPage() {
  return (
    <MainLayout>
      <Head>
        <title>نقش‌ها | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-zinc-800 text-white shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">نقش‌ها و دسترسی‌ها</h1>
            <p className="text-sm text-muted-foreground">مدل دسترسی مبتنی بر نقش</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((r) => (
            <Card key={r.id} className="rounded-2xl">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{r.name}</p>
                  <Badge variant="outline" className="font-mono text-xs">
                    {r.id}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.perms.map((p) => (
                    <Badge key={p} variant="secondary" className="rounded-full">
                      {p}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
