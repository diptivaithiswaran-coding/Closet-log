"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "./actions";
import ClosetRail from "./ClosetRail";

type Props = {
  mode: "login" | "signup";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
};

export default function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isLogin = mode === "login";

  return (
    <main className="auth-split">
      <section className="auth-hero">
        <p className="auth-wordmark">Closet Log</p>
        <p className="auth-tagline">Track what you own and what you actually wear.</p>
        <ClosetRail />
      </section>

      <section className="auth-panel">
        <form action={formAction} className="stack auth-form">
          <h1>{isLogin ? "Welcome back" : "Start your closet"}</h1>
          <p className="muted">
            {isLogin ? "Log in to see your pieces and outfits." : "Make an account. It takes about ten seconds."}
          </p>

          <label>
            Email
            <input name="email" type="email" autoComplete="email" />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>

          {state.error && <p className="error" role="alert">{state.error}</p>}

          <button className="btn btn-block" disabled={pending}>
            {pending ? "One sec…" : isLogin ? "Log in" : "Sign up"}
          </button>

          <p className="muted small">
            {isLogin ? (
              <>New here? <Link href="/signup">Create an account</Link></>
            ) : (
              <>Already have an account? <Link href="/login">Log in</Link></>
            )}
          </p>
        </form>
      </section>
    </main>
  );
}
