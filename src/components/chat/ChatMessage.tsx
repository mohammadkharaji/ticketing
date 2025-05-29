import React from "react";

interface ChatMessageProps {
  message: {
    id: string;
    message: string;
    senderId: string;
    createdAt?: string;
    senderName?: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex items-start gap-2 p-2 rounded hover:bg-muted/50">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
        {message.senderName ? message.senderName[0] : message.senderId[0]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{message.senderName || message.senderId}</span>
          {message.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="text-sm mt-1 whitespace-pre-line">{message.message}</div>
      </div>
    </div>
  );
}
