import { signOutAdmin } from "@/app/actions";

export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button
        type="submit"
        className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-white"
      >
        End admin session
      </button>
    </form>
  );
}
