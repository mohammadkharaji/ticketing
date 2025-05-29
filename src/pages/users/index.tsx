import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Search } from "lucide-react";
import userService, { UserWithDepartment } from "@/services/userService";
import { formatPersianDate } from "@/lib/date-utils";

export default function UsersPage() {
  const { isAdmin, isDepartmentManager } = useAuth();
  const [users, setUsers] = useState<UserWithDepartment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const filters: any = {
          page: currentPage,
          pageSize,
          searchTerm,
        };        if (roleFilter && roleFilter !== "all") filters.role = roleFilter;
        if (departmentFilter && departmentFilter !== "all") filters.department_id = departmentFilter;
        if (isActiveFilter !== undefined) filters.is_active = isActiveFilter;

        const { users, count } = await userService.getUsers(filters);
        setUsers(users);
        setTotalCount(count);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, departmentFilter, isActiveFilter]);

  const getRoleName = (roleId: string) => {
    switch (roleId) {
      case "admin":
        return "مدیر سیستم";
      case "department_manager":
        return "مدیر دپارتمان";
      case "branch_manager":
        return "مدیر شعبه";
      case "ceo":
        return "مدیرعامل";
      case "deputy":
        return "معاون";
      case "support":
        return "پشتیبان";
      case "user":
        return "کاربر";
      default:
        return roleId;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">کاربران</h1>
          {isAdmin && (
            <Button>
              افزودن کاربر جدید
            </Button>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="نقش" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="admin">مدیر سیستم</SelectItem>
              <SelectItem value="department_manager">مدیر دپارتمان</SelectItem>
              <SelectItem value="branch_manager">مدیر شعبه</SelectItem>
              <SelectItem value="ceo">مدیرعامل</SelectItem>
              <SelectItem value="deputy">معاون</SelectItem>
              <SelectItem value="support">پشتیبان</SelectItem>
              <SelectItem value="user">کاربر</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="دپارتمان" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              {/* TODO: Add department list */}
            </SelectContent>
          </Select>          <Select 
            value={isActiveFilter === undefined ? "all" : isActiveFilter.toString()} 
            onValueChange={(value) => setIsActiveFilter(value === "all" ? undefined : value === "true")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger><SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="true">فعال</SelectItem>
              <SelectItem value="false">غیرفعال</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>{user.first_name} {user.last_name}</span>
                  <span className="text-sm text-muted-foreground">
                    {getRoleName(user.role_id || "")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>ایمیل: {user.email}</span>
                    <span>دپارتمان: {user.department?.name || "تعیین نشده"}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>وضعیت: {user.is_active ? "فعال" : "غیرفعال"}</span>
                    <span>تاریخ ثبت‌نام: {formatPersianDate(user.created_at || "")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalCount > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </MainLayout>
  );
}
