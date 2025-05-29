// TEST FILE: پاکسازی بعد از توسعه فراموش نشود!
// این فایل فقط برای تست نمایش سایدبار و MainLayout است و بعد از اتمام کار باید حذف شود.

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TestSidebarPage() {
  const { isOpen, toggleSidebar, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Initial size
    if (typeof window !== 'undefined') {
      updateWindowSize();
    }
    
    // Add event listener
    window.addEventListener('resize', updateWindowSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>تست صفحه سایدبار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">وضعیت سایدبار</h3>
                  <ul className="space-y-2">
                    <li><strong>نمایش:</strong> {isOpen ? 'باز' : 'بسته'}</li>
                    <li><strong>حالت نمایش:</strong> {isMobile ? 'موبایل' : 'دسکتاپ'}</li>
                    <li><strong>عرض صفحه:</strong> {windowSize.width}px</li>
                    <li><strong>ارتفاع صفحه:</strong> {windowSize.height}px</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">کنترل‌ها</h3>
                  <div className="space-y-2">
                    <Button onClick={toggleSidebar} className="w-full">
                      {isOpen ? "بستن سایدبار" : "نمایش سایدبار"}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => setOpen(true)} variant="outline">باز کردن</Button>
                      <Button onClick={() => setOpen(false)} variant="outline">بستن</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
