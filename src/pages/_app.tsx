import "../styles/globals.css";
import "../styles/dropdown-fix.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Head from "next/head";
import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>سیستم مدیریت تیکت‌های سازمانی</title>
            </Head>
            <div className="rtl">
              <Component {...pageProps} />
              <Toaster />
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
