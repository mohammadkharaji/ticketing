import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import userService, { UserWithDepartment } from "@/services/userService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function ManagersPage() {
  const [users, setUsers] = useState<UserWithDepartment[]>([]);

  useEffect(() => {
    Promise.all([
      userService.getUsers({ role: "department_manager", pageSize: 50 }),
      userService.getUsers({ role: "branch_manager", pageSize: 50 }),
      userService.getUsers({ role: "admin", pageSize: 50 }),
    ]).then(([a, b, c]) => {
      setUsers([...a.users, ...b.users, ...c.users]);
    });
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>مدیران | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-zinc-800 text-white shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">مدیران</h1>
            <p className="text-sm text-muted-foreground">{users.length} نفر</p>
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
                <Badge variant="secondary" className="rounded-full">
                  {u.role_id}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
