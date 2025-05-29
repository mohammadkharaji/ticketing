import React, { useEffect, useState } from "react";
import userService from "@/services/userService";
import { User } from "@/models/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(
        data.users.map((u) => ({
          id: u.id,
          username: u.email.split("@")[0],
          displayName: (u.first_name || "") + " " + (u.last_name || ""),
          email: u.email,
          departmentId: u.department_id || "",
          role: u.role_id as any || "user",
          isActive: u.is_active ?? true,
          createdAt: u.created_at || "",
          updatedAt: u.updated_at || "",
        }))
      );
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>لیست کاربران</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>در حال بارگذاری...</div>
        ) : users.length === 0 ? (
          <div>کاربری یافت نشد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rtl">
              <thead>
                <tr>
                  <th>نام کاربری</th>
                  <th>نام کامل</th>
                  <th>ایمیل</th>
                  <th>نقش</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge>{user.role}</Badge>
                    </td>
                    <td>
                      {user.isActive ? (
                        <Badge variant="default">فعال</Badge>
                      ) : (
                        <Badge variant="destructive">غیرفعال</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
