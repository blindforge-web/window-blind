import { signOutCustomer } from "@/app/actions";

export function CustomerSignOutButton() {
  return (
    <form action={signOutCustomer}>
      <button
        type="submit"
        className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
      >
        End session
      </button>
    </form>
  );
}
