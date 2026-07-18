import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import userService, { UserWithDepartment } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Users } from "lucide-react";

const roleName: Record<string, string> = {
  admin: "مدیر سیستم",
  department_manager: "مدیر دپارتمان",
  branch_manager: "مدیر شعبه",
  ceo: "مدیرعامل",
  deputy: "معاون",
  support: "کارشناس",
  user: "کاربر",
};

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithDepartment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { users: list } = await userService.getUsers({
        page: 1,
        pageSize: 100,
        searchTerm: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      setUsers(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  return (
    <MainLayout>
      <Head>
        <title>کاربران | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">کاربران</h1>
              <p className="text-sm text-muted-foreground">{users.length} کاربر</p>
            </div>
          </div>
          {isAdmin && (
            <Button
              className="gap-2 rounded-xl"
              onClick={() => router.push("/admin/create-user")}
            >
              <UserPlus className="h-4 w-4" />
              کاربر جدید
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="rounded-xl pr-10"
              placeholder="جستجوی نام یا ایمیل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="rounded-xl sm:w-48">
              <SelectValue placeholder="نقش" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه نقش‌ها</SelectItem>
              <SelectItem value="admin">مدیر سیستم</SelectItem>
              <SelectItem value="support">کارشناس</SelectItem>
              <SelectItem value="department_manager">مدیر دپارتمان</SelectItem>
              <SelectItem value="branch_manager">مدیر شعبه</SelectItem>
              <SelectItem value="user">کاربر</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" className="rounded-xl" onClick={load}>
            اعمال
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {users.map((u) => (
              <Card key={u.id} className="rounded-2xl">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">
                      {u.first_name} {u.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.job_title || "—"} · {u.department_id || "بدون دپارتمان"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {roleName[u.role_id || ""] || u.role_id}
                    </Badge>
                    <Badge
                      variant={u.is_active ? "default" : "outline"}
                      className="rounded-full"
                    >
                      {u.is_active ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
