import React from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfileSettingsPage() {
  const { userProfile, isAdmin } = useAuth();

  return (
    <MainLayout>
      <Head>
        <title>پروفایل | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>
              {userProfile?.firstName} {userProfile?.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="text-muted-foreground">ایمیل</span>
              <span>{userProfile?.email}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-muted-foreground">نقش</span>
              <Badge className="rounded-full">{userProfile?.roleId}</Badge>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-muted-foreground">دپارتمان</span>
              <span>{userProfile?.departmentId || "—"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">وضعیت</span>
              <Badge variant={userProfile?.isActive ? "default" : "outline"}>
                {userProfile?.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            {isAdmin && (
              <p className="pt-2 text-xs text-muted-foreground">
                شما دسترسی مدیر سیستم دارید.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
