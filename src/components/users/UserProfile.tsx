import { User } from "@/models/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>پروفایل کاربر</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">نام کاربری: {user.username}</div>
        <div className="mb-2">نام کامل: {user.displayName}</div>
        <div className="mb-2">ایمیل: {user.email}</div>
        <div className="mb-2">نقش: <Badge>{user.role}</Badge></div>
        <div className="mb-2">وضعیت: {user.isActive ? <Badge variant="default">فعال</Badge> : <Badge variant="destructive">غیرفعال</Badge>}</div>
        <div className="mb-2">دپارتمان: {user.departmentId}</div>
        <div className="mb-2">تاریخ ایجاد: {user.createdAt}</div>
        <div className="mb-2">تاریخ بروزرسانی: {user.updatedAt}</div>
      </CardContent>
    </Card>
  );
}
