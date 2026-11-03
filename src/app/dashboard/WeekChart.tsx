"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { week: string; label: string; count: number };

export default function WeekChart({ data }: { data: Point[] }) {
  return (
    <div className="chart" role="img" aria-label="Bar chart of outfits logged per week for the last 8 weeks">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f6cadb" />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#eeb3c8" }} tick={{ fill: "#8a5873", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#8a5873", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(232, 51, 122, 0.1)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid #f6cadb", fontSize: 13 }}
            labelFormatter={(l) => `Week of ${l}`}
            formatter={(v) => [`${v} ${v === 1 ? "outfit" : "outfits"}`, ""]}
            separator=""
          />
          <Bar dataKey="count" fill="#e8337a" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
