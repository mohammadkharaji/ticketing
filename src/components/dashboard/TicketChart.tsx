import React from "react";

interface TicketChartProps {
  data: { label: string; value: number }[];
  title?: string;
}

export default function TicketChart({ data, title }: TicketChartProps) {
  // نمایش ساده به صورت bar chart متنی (در پروژه واقعی می‌توانید از chart.js یا recharts استفاده کنید)
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-card rounded shadow p-4">
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <div className="space-y-2">
        {data.map((d, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-24 text-xs truncate">{d.label}</span>
            <div className="flex-1 bg-muted rounded h-3 relative">
              <div
                className="bg-primary h-3 rounded"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs w-8 text-end">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
