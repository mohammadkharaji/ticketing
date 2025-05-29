import React from "react";

interface PerformanceMetricsProps {
  metrics: { label: string; value: string | number; icon?: React.ReactNode; colorClass?: string }[];
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, idx) => (
        <div key={idx} className="col-span-1">
          {/* استفاده از StatCard */}
          {/* <StatCard ... /> */}
          <div className={`rounded-lg p-4 flex items-center gap-4 shadow-sm ${m.colorClass || "bg-primary/10 text-primary"}`}>
            {m.icon && <div className="text-2xl">{m.icon}</div>}
            <div>
              <div className="text-lg font-bold">{m.value}</div>
              <div className="text-sm text-muted-foreground">{m.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
