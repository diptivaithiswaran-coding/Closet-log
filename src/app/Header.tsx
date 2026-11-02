import Link from "next/link";
import { logOut } from "./auth/actions";

export default function Header({ email }: { email: string }) {
  return (
    <header className="header">
      <Link href="/" className="brand">Closet Log</Link>
      <nav className="nav">
        <Link href="/">Closet</Link>
        <Link href="/outfits">Outfits</Link>
        <Link href="/starred">Starred</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/forgotten">Forgotten</Link>
        <Link href="/pick">Random pick</Link>
        <span className="muted small hide-sm">{email}</span>
        <form action={logOut}>
          <button className="btn-link">Log out</button>
        </form>
      </nav>
    </header>
  );
}
