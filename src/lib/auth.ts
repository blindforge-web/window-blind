import type { AdminIdentity } from "@/lib/types";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminProfileRow = {
  full_name: string | null;
  is_active: boolean | null;
};

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  if (!hasPublicSupabaseConfig) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("full_name, is_active")
    .eq("user_id", user.id)
    .maybeSingle<AdminProfileRow>();

  if (!adminProfile?.is_active) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: adminProfile.full_name ?? "Admin",
  };
}
