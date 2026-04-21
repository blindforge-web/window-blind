import { toggleDeliveryState } from "@/app/actions";
import type { DeliveryState } from "@/lib/types";

export function DeliveryStateCard({
  deliveryState,
  actionsEnabled,
}: {
  deliveryState: DeliveryState;
  actionsEnabled: boolean;
}) {
  return (
    <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold">{deliveryState.name}</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            ETA: {deliveryState.eta}
          </p>
        </div>
        <form action={toggleDeliveryState}>
          <input type="hidden" name="code" value={deliveryState.code} />
          <input
            type="hidden"
            name="nextState"
            value={String(!deliveryState.isActive)}
          />
          <button
            type="submit"
            disabled={!actionsEnabled}
            className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60 ${
              deliveryState.isActive
                ? "bg-emerald-100 text-emerald-900"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {deliveryState.isActive ? "Enabled" : "Paused"}
          </button>
        </form>
      </div>
    </article>
  );
}
