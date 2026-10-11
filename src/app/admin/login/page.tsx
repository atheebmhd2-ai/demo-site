import { redirect } from "next/navigation";
import { getOwner, hasOwner, createLoginChallenge } from "@/lib/auth";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getOwner()) redirect("/admin");
  const setup = !await hasOwner();
  const { error } = await searchParams;
  const challenge = await createLoginChallenge();
  return <main className="login-page"><div className="login-image"><a href="/" className="login-back"><ArrowLeft size={17} /> Back to website</a><div className="login-image-copy"><span>✳ THE GRIND STUDIO</span><h2>A little place<br />for big ideas.</h2><p>Good coffee starts with the details.</p></div></div><div className="login-panel"><div className="login-box"><a href="/" className="admin-wordmark">grind<span>✳</span></a><div className="login-icon"><LockKeyhole size={23} /></div><p className="admin-kicker">THE OWNER&apos;S CORNER</p><h1>{setup ? "Set up your space." : "Welcome back."}</h1><p className="login-subtitle">{setup ? "Create your private owner account to start managing your coffee shop." : "Your dashboard is ready. Sign in with the email and password you used to create your owner account."}</p>{error && <div className="form-error">{error}</div>}<LoginForm setup={setup} challenge={challenge} /><p className="login-note">Private access for the Grind team only.</p></div></div></main>;
}
