import { redirect } from "next/navigation";
import { getOwner } from "@/lib/auth";
import { getContent, isSupabaseConfigured } from "@/lib/content";
import { Dashboard } from "@/components/dashboard";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const owner = await getOwner();
  if (!owner) redirect("/admin/login");
  const content = await getContent();
  return <Dashboard content={content} email={owner.email} connected={isSupabaseConfigured()} />;
}
