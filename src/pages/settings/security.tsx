import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SecuritySettingsPage() {
  // فرض بر این است که احراز هویت دو مرحله‌ای و سایر تنظیمات امنیتی از اکتیودایرکتوری مدیریت می‌شود
  const [twoFactorEnabled] = useState(true); // فقط نمایشی

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات امنیتی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">احراز هویت دو مرحله‌ای</h2>
            <p className="mb-2">امنیت حساب شما با احراز هویت دو مرحله‌ای افزایش یافته است.</p>
            <div>
              <span className="inline-block px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">فعال</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">فعال‌سازی و مدیریت این قابلیت فقط از طریق اکتیودایرکتوری سازمان انجام می‌شود.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">تغییر رمز عبور</h2>
            <p className="mb-2">تغییر رمز عبور فقط از طریق واحد IT یا اکتیودایرکتوری سازمان امکان‌پذیر است.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
