import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Role {
  id: string;
  name: string;
  description?: string;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API/service call
    async function fetchRoles() {
      setLoading(true);
      // Mock data for roles
      setRoles([
        { id: "1", name: "admin", description: "مدیر کل سیستم" },
        { id: "2", name: "manager", description: "مدیر دپارتمان" },
        { id: "3", name: "expert", description: "کارشناس" },
        { id: "4", name: "user", description: "کاربر عادی" },
      ]);
      setLoading(false);
    }
    fetchRoles();
  }, []);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>مدیریت نقش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>در حال بارگذاری...</div>
          ) : roles.length === 0 ? (
            <div>نقشی یافت نشد.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rtl">
                <thead>
                  <tr>
                    <th>نام نقش</th>
                    <th>توضیحات</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>{role.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
