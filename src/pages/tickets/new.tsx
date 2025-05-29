import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ticketService from "@/services/ticketService";
import { toast } from "@/hooks/use-toast";

interface Status {
  id: string;
  name: string;
  is_closed: boolean;
}

interface Priority {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const { user, userProfile, loading, refreshAuth } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  // تابع نمایش خطا
  const showError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: errorMessage,
      description: "",
      variant: "destructive",
    });
  };

  console.log("NewTicketPage rendering, auth state:", { 
    loading,
    user: user ? "exists" : "null", 
    userProfile: userProfile ? "exists" : "null" 
  });
    // Try to refresh auth if no user profile is detected
  useEffect(() => {
    if (!user && !loading) {
      console.log("No user detected, refreshing auth...");
      refreshAuth();
      
      // Add a timeout to redirect to login if refreshAuth doesn't work
      const timer = setTimeout(() => {
        if (!user) {
          console.log("Still no user after refresh, redirecting to login...");
          router.push("/auth/login?redirect=/tickets/new");
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, refreshAuth, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch mock data for now
        setPriorities([
          { id: "high", name: "بالا" },
          { id: "medium", name: "متوسط" },
          { id: "low", name: "پایین" }
        ]);
        
        setCategories([
          { id: "technical", name: "فنی" },
          { id: "financial", name: "مالی" },
          { id: "administrative", name: "اداری" }
        ]);
        
        setDepartments([
          { id: "it", name: "فناوری اطلاعات" },
          { id: "finance", name: "مالی" },
          { id: "admin", name: "اداری" }
        ]);
        
        setBranches([
          { id: "tehran", name: "تهران" },
          { id: "tabriz", name: "تبریز" },
          { id: "shiraz", name: "شیراز" }
        ]);

        // Set default status to open
        setStatusId("open");

        // Set default department for branch managers
        if (userProfile?.roleId === "branch_manager" && userProfile.departmentId) {
          setDepartmentId(userProfile.departmentId);
        }

        // Set default branch for branch managers
        if (userProfile?.roleId === "branch_manager" && userProfile.branchId) {
          setBranchId(userProfile.branchId);
        }

        setIsLoading(false);      } catch (err) {
        console.error("Error fetching form data:", err);
        const errorMessage = err instanceof Error ? err.message : "خطا در دریافت اطلاعات";
        showError(errorMessage);
        setIsLoading(false);
      }
    };

    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;    // Validate form
    if (!title.trim()) {
      showError("لطفاً عنوان تیکت را وارد کنید");
      return;
    }

    if (!description.trim()) {
      showError("لطفاً توضیحات تیکت را وارد کنید");
      return;
    }

    if (!priorityId) {
      showError("لطفاً اولویت تیکت را انتخاب کنید");
      return;
    }

    if (!categoryId) {
      showError("لطفاً دسته‌بندی تیکت را انتخاب کنید");
      return;
    }

    if (!departmentId) {
      showError("لطفاً دپارتمان را انتخاب کنید");
      return;
    }

    setIsSubmitting(true);
    try {
      const ticket = await ticketService.createTicket({
        title,
        description,
        statusId,
        priorityId,
        categoryId,
        departmentId,
        branchId: branchId || undefined,
        creatorId: user.id,
      });

      // نمایش پیام موفقیت آمیز
      toast({
        title: "تیکت با موفقیت ایجاد گردید.",
        description: "",
        variant: "success",
      });

      if (ticket) {
        router.push("/dashboard"); // ریدایرکت به داشبورد
      }    } catch (error: any) {
      console.error("Error creating ticket:", error);
      const errorMessage = error?.message || "خطا در ایجاد تیکت، لطفاً دوباره تلاش کنید";
      showError("خطا در ایجاد تیکت: " + errorMessage);
      setIsSubmitting(false);
    }
  };
  if (!userProfile && !loading) {
    console.log("NewTicketPage early return - no user profile and not loading");
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">حساب کاربری</h1>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            <p>برای دسترسی به این صفحه، لطفا وارد حساب کاربری خود شوید.</p>
            <button 
              className="mt-4 bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-md"
              onClick={() => refreshAuth()}
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Create a mock user for testing when in development
  if (!userProfile && loading) {
    console.log("NewTicketPage - loading user profile");
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">در حال بارگذاری...</h1>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
            <p>لطفا صبر کنید...</p>
            <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin mx-auto mt-4"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  // حذف useEffect برای نمایش خطا
  // به جای آن از تابع showError استفاده می‌کنیم که در هر قسمت نیاز به نمایش خطا داریم فراخوانی می‌شود

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">ایجاد تیکت جدید</h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات تیکت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">اولویت</label>
                  <Select value={priorityId} onValueChange={setPriorityId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">دپارتمان</label>
                  <Select 
                    value={departmentId} 
                    onValueChange={setDepartmentId}
                    required
                    disabled={userProfile?.roleId === "branch_manager"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {userProfile?.roleId !== "branch_manager" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">شعبه</label>                    <Select value={branchId} onValueChange={setBranchId}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون شعبه</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium mb-1">ضمیمه فایل</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => {
                      const files = e.target.files ? Array.from(e.target.files) : [];
                      setAttachments(files);
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {attachments && attachments.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
                      {attachments.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "در حال ایجاد..." : "ایجاد تیکت"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
