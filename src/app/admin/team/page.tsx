import { redirect } from "next/navigation";
import { UsersRound } from "lucide-react";
import { AdminPasswordResetPanel } from "@/components/admin/admin-password-reset-panel";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTeamManager } from "@/components/admin/admin-team-manager";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminProfiles } from "@/lib/data";
import {
  hasPublicSupabaseConfig,
  hasServiceRoleConfig,
} from "@/lib/supabase/env";
import { formatCompactNumber } from "@/lib/utils";

export default async function AdminTeamPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const profiles = admin?.role === "super_admin" ? await getAdminProfiles() : [];
  const activeCount = profiles.filter((profile) => profile.isActive).length;

  return (
    <AdminShell
      admin={admin}
      active="team"
      title="Admin users and roles"
      subtitle="Super admins can add new admins, assign operational roles, and remove access for old admins."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Active admins
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(activeCount)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Total profiles
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(profiles.length)}
          </p>
        </div>
      </section>

      {admin ? (
        <>
          <AdminTeamManager
            currentAdmin={admin}
            profiles={profiles}
            serviceEnabled={hasServiceRoleConfig}
          />
          {admin.role === "super_admin" ? <AdminPasswordResetPanel /> : null}
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <UsersRound size={30} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
            Admin access is required
          </h2>
        </section>
      )}
    </AdminShell>
  );
}
