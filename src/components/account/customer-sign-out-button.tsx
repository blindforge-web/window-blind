import { signOutCustomer } from "@/app/actions";

export function CustomerSignOutButton() {
  return (
    <form action={signOutCustomer}>
      <button type="submit" className="ui-button ui-button-outline px-4 py-3 text-sm">
        End Session
      </button>
    </form>
  );
}
