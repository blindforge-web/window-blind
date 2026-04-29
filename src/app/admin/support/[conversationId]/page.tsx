import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { SupportInbox } from "@/components/admin/support-inbox";
import { getCurrentAdmin } from "@/lib/auth";
import {
  getAdminSupportConversation,
  getAdminSupportConversations,
} from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";

export default async function AdminSupportConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const [conversation, conversations] = await Promise.all([
    getAdminSupportConversation(conversationId),
    getAdminSupportConversations({ limit: 90 }),
  ]);

  if (!conversation) {
    notFound();
  }

  const visibleConversations = conversations.some((item) => item.id === conversation.id)
    ? conversations
    : [conversation, ...conversations];

  return (
    <AdminShell
      admin={admin}
      active="support"
      title={conversation.customerName}
      subtitle={conversation.subject}
      actions={
        <Link href="/admin/support" className="ui-button ui-button-outline hidden sm:inline-flex">
          <ArrowLeft size={16} />
          Inbox
        </Link>
      }
    >
      {admin ? (
        <SupportInbox
          admin={admin}
          initialConversations={visibleConversations}
          selectedConversationId={conversation.id}
          basePath="/admin/support"
        />
      ) : (
        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-8 text-sm text-[var(--color-muted)]">
          Admin access is required for the live support inbox.
        </section>
      )}
    </AdminShell>
  );
}
