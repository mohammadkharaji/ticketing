import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function AdminCreateUserPage() {
  const [pending, setPending] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/pending-registrations")
      .then(res => res.json())
      .then(data => setPending(data.pending || []));
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedEmail || !password) {
      setError("ایمیل و رمز عبور الزامی است.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ایجاد کاربر");
      setSuccess("کاربر با موفقیت ایجاد شد و از لیست حذف شد.");
      setPending(pending.filter(e => e !== selectedEmail));
      setSelectedEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "خطا در ایجاد کاربر");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Head>
        <title>ایجاد کاربر جدید توسط ادمین</title>
      </Head>
      <div className="min-h-screen flex bg-background p-4 rtl">
        <div className="flex w-full max-w-6xl min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r rounded-lg shadow-md p-4 hidden md:flex flex-col min-h-full">
            <nav className="flex flex-col gap-4">
              <Link href="/admin" className="font-bold hover:text-blue-600">داشبورد ادمین</Link>
              <Link href="/admin/pending-registrations" className="hover:text-blue-600">ثبت‌نام‌های جدید</Link>
              <Link href="/admin/create-user" className="hover:text-blue-600">ایجاد کاربر جدید</Link>
              <Link href="/admin/users" className="hover:text-blue-600">مدیریت کاربران</Link>
              <Link href="/admin/roles" className="hover:text-blue-600">نقش‌ها</Link>
              <Link href="/admin/departments" className="hover:text-blue-600">دپارتمان‌ها</Link>
              <Link href="/admin/branches" className="hover:text-blue-600">شعب</Link>
              <Link href="/dashboard" className="hover:text-blue-600">پنل کاربری</Link>
              <button
                onClick={async () => {
                  if (typeof window !== 'undefined') {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/auth/login';
                  }
                }}
                className="text-red-600 hover:underline text-right mt-8"
              >
                خروج از حساب کاربری
              </button>
            </nav>
          </aside>
          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <Card>
                <CardHeader>
                  <CardTitle>ایجاد کاربر جدید توسط ادمین</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">ثبت‌نام‌های جدید:</h3>
                    {pending.length === 0 ? (
                      <div className="text-muted-foreground">در حال حاضر ثبت‌نام جدیدی وجود ندارد.</div>
                    ) : (
                      <ul className="space-y-2">
                        {pending.map(email => (
                          <li key={email} className="flex items-center gap-2">
                            <Button
                              variant={selectedEmail === email ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedEmail(email)}
                            >
                              {email}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="selectedEmail">ایمیل انتخاب شده</Label>
                      <Input id="selectedEmail" value={selectedEmail} disabled readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">رمز عبور اولیه</Label>
                      <Input
                        id="password"
                        type="text"
                        placeholder="رمز عبور اولیه را وارد کنید"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-700 text-sm">{success}</div>}
                    <Button type="submit" className="w-full" disabled={creating || !selectedEmail || !password}>
                      {creating ? "در حال ایجاد..." : "ایجاد کاربر"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
