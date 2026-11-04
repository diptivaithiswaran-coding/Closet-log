"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Closet" },
  { href: "/outfits", label: "Outfits" },
  { href: "/starred", label: "Starred" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/forgotten", label: "Not worn lately" },
  { href: "/pick", label: "Random pick" },
];

// Main menu. The current page is highlighted so you always know where you are.
export default function NavLinks() {
  const path = usePathname();
  const isActive = (href: string) =>
    href === "/" ? path === "/" || path.startsWith("/pieces") : path.startsWith(href);

  return (
    <nav className="nav" aria-label="Main">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={isActive(l.href) ? "nav-link on" : "nav-link"} aria-current={isActive(l.href) ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
