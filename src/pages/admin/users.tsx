import React, { useEffect } from "react";
import { useRouter } from "next/router";

/** Redirect legacy admin users path to main users page */
export default function AdminUsersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/users");
  }, [router]);
  return null;
}
