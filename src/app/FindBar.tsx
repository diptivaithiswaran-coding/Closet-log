"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import { SORTS, type FindOptions } from "@/lib/find";
import { capitalize } from "@/lib/format";

// Search box, category filter, and sort. Everything lives in the URL
// (?q=…&category=…&sort=…), so a filtered view can be refreshed or shared.
export default function FindBar({ initial }: { initial: FindOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initial.q);
  const first = useRef(true);

  function go(next: Partial<FindOptions>) {
    const opts = { ...initial, q, ...next };
    const params = new URLSearchParams();
    if (opts.q) params.set("q", opts.q);
    if (opts.category) params.set("category", opts.category);
    if (opts.sort !== "newest") params.set("sort", opts.sort);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Search as you type, after a short pause.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => go({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filtered = !!(initial.q || initial.category);

  return (
    <div className="findbar" role="search">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or brand"
        aria-label="Search pieces by name or brand"
      />
      <select
        value={initial.category}
        onChange={(e) => go({ category: e.target.value as FindOptions["category"] })}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{capitalize(c)}</option>
        ))}
      </select>
      <select
        value={initial.sort}
        onChange={(e) => go({ sort: e.target.value as FindOptions["sort"] })}
        aria-label="Sort pieces"
      >
        {Object.entries(SORTS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      {filtered && (
        <button
          type="button"
          className="btn-link small"
          onClick={() => {
            setQ("");
            router.replace(initial.sort !== "newest" ? `${pathname}?sort=${initial.sort}` : pathname, { scroll: false });
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
