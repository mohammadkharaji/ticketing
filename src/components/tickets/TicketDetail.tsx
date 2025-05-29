import React, { useState } from "react";

interface TicketDetailProps {
  title: string;
  description: string;
  status: string;
  priority: string;
  creator: string;
  createdAt: string;
}

export default function TicketDetail({ title, description, status, priority, creator, createdAt }: TicketDetailProps) {
  return (
    <div className="border rounded p-4 bg-background mb-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="mb-2 text-muted-foreground">توسط {creator} - {new Date(createdAt).toLocaleString("fa-IR")}</div>
      <div className="mb-2">وضعیت: <span className="font-bold">{status}</span></div>
      <div className="mb-2">اولویت: <span className="font-bold">{priority}</span></div>
      <div className="whitespace-pre-line">{description}</div>
    </div>
  );
}
