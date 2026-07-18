import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import departmentService from "@/services/departmentService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDepartmentsPage() {
  const { isAdmin } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setList(await departmentService.getDepartments());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    const d = await departmentService.createDepartment({ name: name.trim() });
    if (d) {
      toast({ title: "دپارتمان ایجاد شد" });
      setName("");
      load();
    } else toast({ title: "خطا", variant: "destructive" });
  };

  return (
    <MainLayout>
      <Head>
        <title>دپارتمان‌ها | تیکت‌یار</title>
      </Head>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-lg">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">دپارتمان‌ها</h1>
            <p className="text-sm text-muted-foreground">{list.length} دپارتمان</p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <Input
              className="rounded-xl"
              placeholder="نام دپارتمان جدید"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button className="gap-2 rounded-xl" onClick={create}>
              <Plus className="h-4 w-4" />
              افزودن
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((d) => (
              <Card key={d.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {d.description || "بدون توضیح"}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{d.id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
