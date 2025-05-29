import React from "react";

interface RecentTicketsProps {
  tickets: { id: string; title: string; status: string; createdAt: string }[];
  onTicketClick?: (id: string) => void;
}

export default function RecentTickets({ tickets, onTicketClick }: RecentTicketsProps) {
  return (
    <div className="bg-card rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">تیکت‌های اخیر</h2>
      {tickets.length === 0 ? (
        <div className="text-muted-foreground">تیکت فعالی وجود ندارد.</div>
      ) : (
        <ul className="divide-y">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="py-2 cursor-pointer hover:bg-muted/50 px-2 rounded"
              onClick={() => onTicketClick && onTicketClick(t.id)}
              tabIndex={0}
              role="button"
              aria-label={t.title}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") onTicketClick && onTicketClick(t.id);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{t.title}</span>
                <span className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString("fa-IR")}</span>
              </div>
              <div className="text-xs mt-1">وضعیت: {t.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
