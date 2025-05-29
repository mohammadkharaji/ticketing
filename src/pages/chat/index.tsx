import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChatIndexPage() {
  // TODO: Replace with real chat room list from API/service
  const chatRooms = [
    { id: "general", name: "گفتگو عمومی" },
    { id: "it", name: "پشتیبانی IT" },
    { id: "hr", name: "منابع انسانی" },
  ];

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>اتاق‌های گفتگو</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {chatRooms.map((room) => (
              <li key={room.id}>
                <Link href={`/chat/${room.id}`} className="text-blue-600 hover:underline">
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
