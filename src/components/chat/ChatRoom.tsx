import React, { ReactNode } from "react";

interface ChatRoomProps {
  children: ReactNode;
}

export default function ChatRoom({ children }: ChatRoomProps) {
  return (
    <div className="bg-card rounded shadow p-4 max-w-2xl mx-auto flex flex-col min-h-[400px]">
      {children}
    </div>
  );
}
