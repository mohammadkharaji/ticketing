import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import userService, { UserWithDepartment } from "@/services/userService";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function EmployeesPage() {
  const [users, setUsers] = useState<UserWithDepartment[]>([]);

  useEffect(() => {
    userService.getUsers({ role: "user", pageSize: 100 }).then((r) => setUsers(r.users));
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>کارمندان | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">کارمندان</h1>
            <p className="text-sm text-muted-foreground">{users.length} نفر</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {users.map((u) => (
            <Card key={u.id} className="rounded-2xl">
              <CardContent className="p-4">
                <p className="font-semibold">
                  {u.first_name} {u.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
