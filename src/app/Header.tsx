import Link from "next/link";
import { logOut } from "./auth/actions";

export default function Header({ email }: { email: string }) {
  return (
    <header className="header">
      <Link href="/" className="brand">Closet Log</Link>
      <nav className="nav">
        <span className="muted small">{email}</span>
        <form action={logOut}>
          <button className="btn-link">Log out</button>
        </form>
      </nav>
    </header>
  );
}
