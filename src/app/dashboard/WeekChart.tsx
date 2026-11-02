"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { week: string; label: string; count: number };

export default function WeekChart({ data }: { data: Point[] }) {
  return (
    <div className="chart" role="img" aria-label="Bar chart of outfits logged per week for the last 8 weeks">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e8e1d6" />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#d8d0c3" }} tick={{ fill: "#6f6a63", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#6f6a63", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(201, 139, 139, 0.12)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid #e8e1d6", fontSize: 13 }}
            labelFormatter={(l) => `Week of ${l}`}
            formatter={(v) => [`${v} ${v === 1 ? "outfit" : "outfits"}`, ""]}
            separator=""
          />
          <Bar dataKey="count" fill="#c98b8b" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
