"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "./actions";

type Props = {
  mode: "login" | "signup";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
};

export default function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isLogin = mode === "login";

  return (
    <main className="auth">
      <h1 className="brand">Closet Log</h1>
      <p className="muted">Track what you own and what you actually wear.</p>

      <form action={formAction} className="card stack">
        <h2>{isLogin ? "Log in" : "Create your account"}</h2>

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

        <button className="btn" disabled={pending}>
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
    </main>
  );
}
