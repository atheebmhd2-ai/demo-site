import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminSessions, adminUsers, loginChallenges } from "@/db/schema";
import { eq, lt, and, gt } from "drizzle-orm";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const cookieName = "grind_admin_session";
const useSupabaseAuth = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const configuredEmail = () => process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";

export async function createLoginChallenge() {
  const token = randomBytes(32).toString("hex");
  await db.delete(loginChallenges).where(lt(loginChallenges.expiresAt, new Date()));
  await db.insert(loginChallenges).values({ tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  return token;
}

export async function consumeLoginChallenge(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const used = await db.delete(loginChallenges).where(and(eq(loginChallenges.tokenHash, hashToken(token)), gt(loginChallenges.expiresAt, new Date()))).returning({ tokenHash: loginChallenges.tokenHash });
  return used.length === 1;
}

async function localOwners() {
  return db.select({ email: adminUsers.email }).from(adminUsers).limit(1);
}

async function allowedSupabaseEmail(email: string) {
  const configured = configuredEmail();
  if (configured) return email.toLowerCase() === configured;
  // Existing preview owners may use the same identity with Supabase Auth.
  const owners = await localOwners();
  return Boolean(owners[0] && email.toLowerCase() === owners[0].email.toLowerCase());
}

export async function authClient() {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: values => {
        try {
          values.forEach(({ name, value, options }) => store.set(name, value, {
            ...options, secure, sameSite: secure ? "none" : "lax", partitioned: secure, path: "/",
          }));
        } catch { /* Server Components cannot refresh cookies; route handlers can. */ }
      },
    },
  });
}

export async function hasOwner() {
  if (configuredEmail()) return true;
  return (await localOwners()).length > 0;
}

export async function getOwner() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (token) {
    const sessions = await db.select().from(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token))).limit(1);
    if (sessions[0] && sessions[0].expiresAt > new Date()) {
      const users = await db.select().from(adminUsers).where(eq(adminUsers.id, sessions[0].userId)).limit(1);
      if (users[0]) return { email: users[0].email };
    }
  }
  if (!useSupabaseAuth()) return null;
  const client = await authClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user?.email || !await allowedSupabaseEmail(user.email)) return null;
  return { email: user.email };
}

export async function loginOwner(email: string, password: string, setup: boolean) {
  const normalizedEmail = email.trim().toLowerCase();
  if (useSupabaseAuth() && await allowedSupabaseEmail(normalizedEmail)) {
    const client = await authClient();
    const { error } = await client.auth.signInWithPassword({ email: normalizedEmail, password });
    if (!error) return null;
    // An existing local preview account may still sign in with its local password.
  }
  if (setup && !await hasOwner()) {
    if (password.length < 8) return "Password must be at least 8 characters.";
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
    try { await db.insert(adminUsers).values({ email: normalizedEmail, passwordHash }); }
    catch {
      if (!await hasOwner()) return "Could not create owner account. Please try again.";
    }
  }
  const users = await db.select().from(adminUsers).where(eq(adminUsers.email, normalizedEmail)).limit(1);
  if (!users[0]) return "No matching owner account. Create this user in Supabase Auth and set ADMIN_EMAIL, or sign in with the existing local owner account.";
  const [salt, expected] = users[0].passwordHash.split(":");
  const actual = scryptSync(password, salt, 64);
  if (!expected || actual.length !== Buffer.from(expected, "hex").length || !timingSafeEqual(actual, Buffer.from(expected, "hex"))) return "Invalid email or password.";
  const token = randomBytes(32).toString("hex");
  await db.insert(adminSessions).values({ userId: users[0].id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
  const secure = process.env.NODE_ENV === "production";
  (await cookies()).set(cookieName, token, {
    httpOnly: true, secure, sameSite: secure ? "none" : "lax", partitioned: secure,
    path: "/", maxAge: 30 * 24 * 60 * 60,
  });
  return null;
}

export async function logoutOwner() {
  if (useSupabaseAuth()) await (await authClient()).auth.signOut();
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (token) await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token)));
  store.delete(cookieName);
}
