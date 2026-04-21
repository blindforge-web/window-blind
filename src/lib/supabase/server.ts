import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasPublicSupabaseConfig, supabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  if (!hasPublicSupabaseConfig) {
    throw new Error("Supabase public environment variables are missing.");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url!, supabaseEnv.anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always mutate cookies during render.
        }
      },
    },
  });
}
