import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  const { userProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile]);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>پروفایل کاربری</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-1">نام</label>
            <input className="input" value={firstName} disabled />
          </div>
          <div className="mb-4">
            <label className="block mb-1">نام خانوادگی</label>
            <input className="input" value={lastName} disabled />
          </div>
          <div className="mb-4">
            <label className="block mb-1">ایمیل</label>
            <input className="input" value={email} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
