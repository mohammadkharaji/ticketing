import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts/MainLayout";
import userService from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function CreateUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("user");
  const [departmentId, setDepartmentId] = useState("support");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.createUser({
        email,
        password,
        firstName,
        lastName,
        roleId,
        departmentId,
      });
      toast({ title: "کاربر ایجاد شد" });
      router.push("/users");
    } catch (err: any) {
      toast({
        title: "خطا",
        description: err?.message || "ایجاد کاربر ناموفق بود",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>ایجاد کاربر | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">ایجاد کاربر جدید</h1>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>اطلاعات کاربر</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>نام</Label>
                  <Input
                    className="rounded-xl"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>نام خانوادگی</Label>
                  <Input
                    className="rounded-xl"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input
                  type="email"
                  className="rounded-xl"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>رمز عبور اولیه</Label>
                <Input
                  type="password"
                  className="rounded-xl"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>نقش</Label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">کاربر</SelectItem>
                      <SelectItem value="support">کارشناس</SelectItem>
                      <SelectItem value="department_manager">مدیر دپارتمان</SelectItem>
                      <SelectItem value="branch_manager">مدیر شعبه</SelectItem>
                      <SelectItem value="admin">مدیر سیستم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>دپارتمان</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">فناوری اطلاعات</SelectItem>
                      <SelectItem value="hr">منابع انسانی</SelectItem>
                      <SelectItem value="finance">مالی</SelectItem>
                      <SelectItem value="sales">فروش</SelectItem>
                      <SelectItem value="support">پشتیبانی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={saving}>
                {saving ? "در حال ذخیره..." : "ایجاد کاربر"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
