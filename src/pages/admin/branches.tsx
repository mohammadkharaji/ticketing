import React, { useEffect, useState } from "react";
import branchService from "@/services/branchService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Branch {
  id: string;
  name: string;
  managerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      setLoading(true);
      const data = await branchService.getBranches();
      setBranches(data);
      setLoading(false);
    }
    fetchBranches();
  }, []);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>مدیریت شعب</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>در حال بارگذاری...</div>
          ) : branches.length === 0 ? (
            <div>شعبه‌ای یافت نشد.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rtl">
                <thead>
                  <tr>
                    <th>نام شعبه</th>
                    <th>مدیر</th>
                    <th>تاریخ ایجاد</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id}>
                      <td>{branch.name}</td>
                      <td>{branch.managerId || '-'}</td>
                      <td>{branch.createdAt ? new Date(branch.createdAt).toLocaleDateString('fa-IR') : '-'}</td>
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
