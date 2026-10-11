import { NextRequest, NextResponse } from "next/server";
import { consumeLoginChallenge, loginOwner } from "@/lib/auth";

function loginPath(error?: string) {
  return error ? `/admin/login?error=${encodeURIComponent(error)}` : "/admin/login";
}

function redirectTo(request: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, request.url), 303);
  response.headers.set("Location", path);
  return response;
}

export async function POST(request: NextRequest) {
  // Native form posts avoid the preview proxy's Server Action origin mismatch.
  // Reject cross-site browser requests, particularly important for first-run setup.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && origin !== "null") {
    let originHost: string;
    try { originHost = new URL(origin).host; }
    catch { return redirectTo(request, loginPath("Invalid request origin.")); }
    if (originHost !== host && !originHost.endsWith(".e2b.app")) {
      return redirectTo(request, loginPath("Invalid request origin."));
    }
  }

  let error: string | null;
  try {
    const form = await request.formData();
    const challenge = String(form.get("challenge") ?? "");
    if (!await consumeLoginChallenge(challenge)) return redirectTo(request, loginPath("Login form expired. Please try again."));
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const setup = form.get("setup") === "true";
    if (!email || !password) error = "Enter your email and password.";
    else error = await loginOwner(email, password, setup);
  } catch (cause) {
    console.error("Owner authentication failed:", cause);
    error = "Could not complete sign in. Please try again.";
  }
  return redirectTo(request, error ? loginPath(error) : "/admin");
}
