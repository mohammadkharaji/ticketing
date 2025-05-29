import React from "react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  colorClass?: string;
}

export default function StatCard({ title, value, icon, colorClass = "bg-primary/10 text-primary" }: StatCardProps) {
  return (
    <div className={`rounded-lg p-4 flex items-center gap-4 shadow-sm ${colorClass}`}>
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </div>
  );
}
