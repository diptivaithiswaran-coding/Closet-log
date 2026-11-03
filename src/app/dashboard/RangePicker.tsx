"use client";

import { usePathname, useRouter } from "next/navigation";

// "Last 8 weeks" or a single year. Saved in the address bar (?range=2026).
export default function RangePicker({ value, years }: { value: string; years: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <select
      value={value}
      aria-label="Show outfits for"
      onChange={(e) => {
        const v = e.target.value;
        router.replace(v === "8w" ? pathname : `${pathname}?range=${v}`, { scroll: false });
      }}
    >
      <option value="8w">Last 8 weeks</option>
      {years.map((y) => (
        <option key={y} value={String(y)}>{y}</option>
      ))}
    </select>
  );
}
