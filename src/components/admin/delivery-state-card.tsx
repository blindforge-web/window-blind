import {
  deleteDeliveryState,
  upsertDeliveryState,
} from "@/app/actions";
import type { DeliveryState } from "@/lib/types";

export function DeliveryStateCard({
  deliveryState,
  actionsEnabled,
}: {
  deliveryState?: DeliveryState;
  actionsEnabled: boolean;
}) {
  const isNew = !deliveryState;

  return (
    <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-4">
      <form action={upsertDeliveryState} className="grid gap-4">
        {deliveryState ? <input type="hidden" name="oldCode" value={deliveryState.code} /> : null}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {isNew ? "New delivery state" : deliveryState.code}
            </p>
            <h3 className="mt-1 text-xl font-extrabold">
              {isNew ? "Add delivery state" : deliveryState.name}
            </h3>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={deliveryState?.isActive ?? true}
              disabled={!actionsEnabled}
            />
            Active
          </label>
        </div>

        {!isNew ? (
          <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/88 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Delivery promise
            </p>
            <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
              {deliveryState.eta}
            </p>
          </div>
        ) : null}

        <details className="rounded-[1.6rem] border border-[var(--color-line)] bg-white/88 p-4" open={isNew}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-ink)]">
            {isNew ? "Add delivery coverage" : "Edit delivery coverage"}
          </summary>
          <div className="mt-4 grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold">Code</span>
              <input
                name="code"
                defaultValue={deliveryState?.code ?? ""}
                placeholder="lagos"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Name</span>
              <input
                name="name"
                defaultValue={deliveryState?.name ?? ""}
                placeholder="Lagos"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">ETA</span>
              <input
                name="eta"
                defaultValue={deliveryState?.eta ?? "3 to 6 working days"}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!actionsEnabled}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isNew ? "Add state" : "Save state"}
          </button>
          {!isNew ? (
            <button
              type="submit"
              formAction={deleteDeliveryState}
              disabled={!actionsEnabled}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
            >
              Delete
            </button>
          ) : null}
        </div>
      </form>
    </article>
  );
}
