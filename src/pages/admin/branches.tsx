import React from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const branches = [
  { code: "211", name: "تهران مرکز", city: "تهران" },
  { code: "212", name: "تهران جنوب", city: "تهران" },
  { code: "214", name: "تهران شرق", city: "تهران" },
  { code: "301", name: "مشهد", city: "خراسان رضوی" },
  { code: "302", name: "اصفهان", city: "اصفهان" },
  { code: "303", name: "شیراز", city: "فارس" },
  { code: "304", name: "تبریز", city: "آذربایجان شرقی" },
  { code: "305", name: "اهواز", city: "خوزستان" },
];

export default function AdminBranchesPage() {
  return (
    <MainLayout>
      <Head>
        <title>شعب | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">شعب</h1>
            <p className="text-sm text-muted-foreground">
              کد شعبه در شماره تیکت استفاده می‌شود
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <Card key={b.code} className="rounded-2xl">
              <CardContent className="p-4">
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.city}</p>
                <p className="mt-1 font-mono text-xs text-primary">کد {b.code}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
