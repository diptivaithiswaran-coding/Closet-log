import Link from "next/link";
import { logOut } from "./auth/actions";
import NavLinks from "./NavLinks";

export default function Header({ email }: { email: string }) {
  const initial = (email.trim()[0] ?? "?").toUpperCase();
  return (
    <header className="header">
      <Link href="/" className="brand">Closet Log</Link>
      <NavLinks />
      {/* Email and Log out live in a small account menu instead of the main row. */}
      <details className="account">
        <summary aria-label="Account menu">
          <span className="avatar" aria-hidden="true">{initial}</span>
        </summary>
        <div className="account-menu">
          <p className="muted small account-email">{email}</p>
          <form action={logOut}>
            <button className="btn btn-secondary btn-sm">Log out</button>
          </form>
        </div>
      </details>
    </header>
  );
}
