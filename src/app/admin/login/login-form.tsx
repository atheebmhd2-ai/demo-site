"use client";

import { ArrowRight } from "lucide-react";

export function LoginForm({ setup, challenge }: { setup: boolean; challenge: string }) {
  return <form action="/api/admin/login" method="post" className="login-form" onSubmit={event => {
    // An opaque-origin sandbox cannot retain its own authentication cookie.
    // Submit the user's gesture into an unsandboxed browser tab instead.
    if (window.origin === "null") event.currentTarget.target = "_blank";
  }}>
    <input type="hidden" name="challenge" value={challenge} />
    <input type="hidden" name="setup" value={setup ? "true" : "false"} />
    <label>Email address<input type="email" name="email" placeholder="you@grindcoffee.co" required autoComplete="email" /></label>
    <label>Password<input type="password" name="password" placeholder="Enter your password" required minLength={setup ? 8 : undefined} autoComplete={setup ? "new-password" : "current-password"} /></label>
    <button type="submit" className="admin-primary">{setup ? "Create owner account" : "Sign in to dashboard"}<ArrowRight size={18} /></button>
  </form>;
}
