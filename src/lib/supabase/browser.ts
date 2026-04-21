"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasPublicSupabaseConfig, supabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  if (!hasPublicSupabaseConfig) {
    return null;
  }

  return createBrowserClient(supabaseEnv.url!, supabaseEnv.anonKey!);
}
