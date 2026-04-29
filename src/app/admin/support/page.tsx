import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { SupportInbox } from "@/components/admin/support-inbox";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminSupportConversations } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type { SupportConversationStatus } from "@/lib/types";
import { formatCompactNumber } from "@/lib/utils";

const supportTabs: Array<{ id: SupportConversationStatus | "all"; label: string }> = [
  { id: "all", label: "All messages" },
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
];

function getStatus(value?: string): SupportConversationStatus | "all" {
  return supportTabs.some((tab) => tab.id === value)
    ? (value as SupportConversationStatus | "all")
    : "all";
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const selectedStatus = getStatus(params.status);
  const query = params.q?.trim() ?? "";
  const conversations = await getAdminSupportConversations({
    status: selectedStatus,
    query,
  });

  return (
    <AdminShell
      admin={admin}
      active="support"
      title="Support messages"
      subtitle="Handle customer messages in one inbox, open a conversation URL, reply, and close resolved support requests."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {supportTabs.map((tab) => {
          const count =
            tab.id === "all"
              ? conversations.length
              : conversations.filter((conversation) => conversation.status === tab.id)
                  .length;

          return (
            <Link
              key={tab.id}
              href={`/admin/support${tab.id === "all" ? "" : `?status=${tab.id}`}`}
              className={`rounded-2xl border bg-white p-5 ${
                selectedStatus === tab.id
                  ? "border-[var(--color-primary)]"
                  : "border-[var(--color-line)]"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {tab.label}
              </p>
              <p className="mt-3 text-3xl font-extrabold">
                {formatCompactNumber(count)}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]" action="/admin/support">
          <input type="hidden" name="status" value={selectedStatus} />
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by customer, email, subject, message, or conversation ID"
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white py-3 pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <button type="submit" className="ui-button ui-button-primary">
            Search messages
          </button>
        </form>
      </section>

      {admin ? (
        <SupportInbox
          admin={admin}
          initialConversations={conversations}
          basePath="/admin/support"
        />
      ) : (
        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-8 text-sm text-[var(--color-muted)]">
          Admin access is required for the live support inbox.
        </section>
      )}

      {!conversations.length ? (
        <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <Inbox size={30} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
            No matching support messages
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Open requests will appear here when customers start or continue a support chat.
          </p>
        </section>
      ) : null}
    </AdminShell>
  );
}
