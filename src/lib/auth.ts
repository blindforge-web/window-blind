import type { AdminIdentity, UserIdentity } from "@/lib/types";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminProfileRow = {
  full_name: string | null;
  role: string | null;
  is_active: boolean | null;
};

function getUserFullName(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  return metadataName || user.email || "Customer";
}

export async function getCurrentUser(): Promise<UserIdentity | null> {
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

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: getUserFullName(user),
  };
}

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
    .select("full_name, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle<AdminProfileRow>();

  if (!adminProfile?.is_active) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: adminProfile.full_name ?? getUserFullName(user),
    role: adminProfile.role ?? "admin",
  };
}
