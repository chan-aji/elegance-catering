"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export function ChartCard({
  title,
  data
}: {
  title: string;
  data: Array<{ label: string; total: number; orders: number }>;
}) {
  return (
    <div className="rounded-[28px] border border-brand-700/10 bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      <div className="mt-5 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d7e7d3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value, name) =>
                name === "total" && typeof value === "number"
                  ? formatCurrency(value)
                  : (value ?? "")
              }
            />
            <Bar dataKey="total" fill="#2E7D32" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
