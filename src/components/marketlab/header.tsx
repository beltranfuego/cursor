import { HeaderNav } from "@/components/marketlab/header-nav";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function Header() {
  const user = isSupabaseConfigured ? await getCurrentUser() : null;
  const profile = user ? await getCurrentProfile() : null;

  return <HeaderNav user={user} profile={profile} />;
}
