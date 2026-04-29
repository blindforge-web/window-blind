import { redirect } from "next/navigation";
import { Truck } from "lucide-react";
import { seedNigeriaDeliveryStates } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { DeliveryStateCard } from "@/components/admin/delivery-state-card";
import { getCurrentAdmin } from "@/lib/auth";
import { getDeliveryStates } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCompactNumber } from "@/lib/utils";

export default async function AdminDeliveryPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const deliveryStates = await getDeliveryStates();
  const activeStates = deliveryStates.filter((state) => state.isActive).length;
  const actionsEnabled = Boolean(admin);

  return (
    <AdminShell
      admin={admin}
      active="delivery"
      title="Delivery coverage"
      subtitle="Control which delivery states customers can select during checkout and keep ETA details easy to maintain."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Active states
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(activeStates)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Total states
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(deliveryStates.length)}
          </p>
        </div>
        <form action={seedNigeriaDeliveryStates} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <button
            type="submit"
            disabled={!actionsEnabled}
            className="ui-button ui-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            Load Nigeria states
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DeliveryStateCard actionsEnabled={actionsEnabled} />
        {deliveryStates.map((deliveryState) => (
          <DeliveryStateCard
            key={deliveryState.code}
            deliveryState={deliveryState}
            actionsEnabled={actionsEnabled}
          />
        ))}
      </section>

      {!deliveryStates.length ? (
        <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <Truck size={30} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
            No delivery states configured
          </h2>
        </section>
      ) : null}
    </AdminShell>
  );
}
