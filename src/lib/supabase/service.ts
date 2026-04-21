import { createClient } from "@supabase/supabase-js";
import { hasServiceRoleConfig, supabaseEnv } from "@/lib/supabase/env";

export function createSupabaseServiceClient() {
  if (!hasServiceRoleConfig) {
    return null;
  }

  return createClient(supabaseEnv.url!, supabaseEnv.serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
