// Test page for debugging component rendering
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { toast } from "../hooks/use-toast";

export default function TestPage() {
  const { user, userProfile, loading, error } = useAuth();
  const [state, setState] = useState({
    authChecked: false
  });

  useEffect(() => {
    // Trigger a re-render once auth state is loaded
    if (!loading) {
      setState({ authChecked: true });
    }
  }, [loading]);
  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Component Test Page</h1>
        
        <div className="bg-gray-100 p-4 mb-8 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Authentication Status:</h2>
          <div className="space-y-2">
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>Auth Checked: {state.authChecked ? "Yes" : "No"}</p>
            <p>User: {user ? "Logged In" : "Not Logged In"}</p>
            <p>Profile: {userProfile ? "Available" : "Not Available"}</p>
            {error && (
              <p className="text-red-500">Error: {error.message}</p>
            )}
          </div>
          
          {user && (
            <div className="mt-4">
              <h3 className="font-medium">User Details:</h3>
              <pre className="bg-gray-200 p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          {userProfile && (
            <div className="mt-4">
              <h3 className="font-medium">Profile Details:</h3>
              <pre className="bg-gray-200 p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 mb-8 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Toast Test:</h2>
          <button
            className="bg-lime-400 text-black font-bold px-4 py-2 rounded hover:bg-lime-300 transition mb-4 mr-2"
            onClick={() => toast({ title: "موفقیت", description: "این یک پیام موفقیت آمیز است", variant: "success" })}
          >
            نمایش Toast موفقیت
          </button>
          <button
            className="bg-red-500 text-black font-bold px-4 py-2 rounded hover:bg-red-400 transition mb-4"
            onClick={() => toast({ title: "خطا", description: "این یک پیام خطا است", variant: "destructive" })}
          >
            نمایش Toast خطا
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
