import type { Tables } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<Tables<"profiles"> | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}
