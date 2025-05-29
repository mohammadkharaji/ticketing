import { useState } from "react";

interface TicketCommentProps {
  author: string;
  message: string;
  createdAt: string;
}

export default function TicketComment({ author, message, createdAt }: TicketCommentProps) {
  return (
    <div className="border rounded p-3 mb-2 bg-background">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold">{author}</span>
        <span className="text-xs text-muted-foreground">{new Date(createdAt).toLocaleString("fa-IR")}</span>
      </div>
      <div className="text-sm whitespace-pre-line">{message}</div>
    </div>
  );
}
