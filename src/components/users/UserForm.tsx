import React, { useState } from "react";
import { User } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface UserFormProps {
  user?: User;
  onSubmit: (data: Partial<User>) => void;
  loading?: boolean;
}

export default function UserForm({ user, onSubmit, loading }: UserFormProps) {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "user");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ displayName, email, role, isActive });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{user ? "ویرایش کاربر" : "افزودن کاربر جدید"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1">نام کامل</label>
            <Input value={displayName} onChange={e => setDisplayName(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <label className="block mb-1">ایمیل</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <label className="block mb-1">نقش</label>
            <select value={role} onChange={e => setRole(e.target.value as User["role"])} disabled={loading} className="input">
              <option value="user">کاربر عادی</option>
              <option value="expert">کارشناس</option>
              <option value="manager">مدیر</option>
              <option value="admin">ادمین</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">وضعیت</label>
            <select value={isActive ? "active" : "inactive"} onChange={e => setIsActive(e.target.value === "active")} disabled={loading} className="input">
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>{user ? "ذخیره تغییرات" : "افزودن کاربر"}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
