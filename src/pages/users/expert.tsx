import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import userService, { UserWithDepartment } from "@/services/userService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

export default function ExpertsPage() {
  const [users, setUsers] = useState<UserWithDepartment[]>([]);

  useEffect(() => {
    userService.getUsers({ role: "support", pageSize: 100 }).then((r) => setUsers(r.users));
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>کارشناسان | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">کارشناسان پشتیبانی</h1>
            <p className="text-sm text-muted-foreground">{users.length} کارشناس</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {users.map((u) => (
            <Card key={u.id} className="rounded-2xl">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <Badge className="rounded-full">{u.department_id || "—"}</Badge>
              </CardContent>
            </Card>
          ))}
          {users.length === 0 && (
            <p className="text-muted-foreground">کارشناسی ثبت نشده است.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
