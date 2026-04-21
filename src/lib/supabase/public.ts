import { createClient } from "@supabase/supabase-js";
import { hasPublicSupabaseConfig, supabaseEnv } from "@/lib/supabase/env";

export function createSupabasePublicClient() {
  if (!hasPublicSupabaseConfig) {
    return null;
  }

  return createClient(supabaseEnv.url!, supabaseEnv.anonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
