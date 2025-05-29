import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>داشبورد مدیریت سامانه</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li>
              <Link href="/admin/users" className="text-blue-600 hover:underline">مدیریت کاربران</Link>
            </li>
            <li>
              <Link href="/admin/roles" className="text-blue-600 hover:underline">مدیریت نقش‌ها</Link>
            </li>
            <li>
              <Link href="/admin/departments" className="text-blue-600 hover:underline">مدیریت دپارتمان‌ها</Link>
            </li>
            <li>
              <Link href="/admin/branches" className="text-blue-600 hover:underline">مدیریت شعب</Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
