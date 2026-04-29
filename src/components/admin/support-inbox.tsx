"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  AdminIdentity,
  SupportConversation,
  SupportMessage,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

type SupportConversationRow = {
  id: string;
  customer_user_id: string;
  customer_name: string;
  customer_email: string | null;
  subject: string;
  status: SupportConversation["status"];
  last_message_at: string;
  created_at: string;
};

type SupportMessageRow = {
  id: string;
  conversation_id: string;
  sender_user_id: string | null;
  sender_role: SupportMessage["senderRole"];
  sender_name: string;
  body: string;
  created_at: string;
};

function mapConversation(row: SupportConversationRow): SupportConversation {
  return {
    id: row.id,
    customerUserId: row.customer_user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    subject: row.subject,
    status: row.status,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    messages: [],
  };
}

function mapMessage(row: SupportMessageRow): SupportMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderUserId: row.sender_user_id,
    senderRole: row.sender_role,
    senderName: row.sender_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

function sortConversations(conversations: SupportConversation[]) {
  return [...conversations].sort(
    (left, right) =>
      new Date(right.lastMessageAt).getTime() -
      new Date(left.lastMessageAt).getTime(),
  );
}

function mergeMessage(
  conversations: SupportConversation[],
  message: SupportMessage,
) {
  return sortConversations(
    conversations.map((conversation) => {
      if (conversation.id !== message.conversationId) {
        return conversation;
      }

      if (conversation.messages.some((item) => item.id === message.id)) {
        return conversation;
      }

      return {
        ...conversation,
        lastMessageAt: message.createdAt,
        status: "open" as const,
        messages: [...conversation.messages, message],
      };
    }),
  );
}

export function SupportInbox({
  admin,
  initialConversations,
  selectedConversationId,
  basePath,
}: {
  admin: AdminIdentity;
  initialConversations: SupportConversation[];
  selectedConversationId?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const [conversations, setConversations] = useState(
    sortConversations(initialConversations),
  );
  const [activeConversationId, setActiveConversationId] = useState(
    selectedConversationId ?? initialConversations[0]?.id ?? "",
  );
  const [draft, setDraft] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      conversations[0] ??
      null,
    [activeConversationId, conversations],
  );

  const openCount = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const channel = supabase
      .channel("admin-support-inbox")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_conversations",
        },
        (payload) => {
          const row = payload.new as SupportConversationRow | null;

          if (!row) {
            return;
          }

          setConversations((current) => {
            const existing = current.find((item) => item.id === row.id);
            const mapped = mapConversation(row);

            if (!existing) {
              return sortConversations([{ ...mapped, messages: [] }, ...current]);
            }

            return sortConversations(
              current.map((item) =>
                item.id === row.id
                  ? {
                      ...item,
                      customerName: mapped.customerName,
                      customerEmail: mapped.customerEmail,
                      subject: mapped.subject,
                      status: mapped.status,
                      lastMessageAt: mapped.lastMessageAt,
                    }
                  : item,
              ),
            );
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
        },
        (payload) => {
          const row = payload.new as SupportMessageRow | null;

          if (!row) {
            return;
          }

          setConversations((current) => mergeMessage(current, mapMessage(row)));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeConversation?.messages.length]);

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = draft.trim();

    if (!activeConversation || !body || isSending) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatusMessage("Support inbox is unavailable right now.");
      return;
    }

    setIsSending(true);
    setStatusMessage("");

    const { data, error } = await supabase
      .from("support_messages")
      .insert({
        conversation_id: activeConversation.id,
        sender_user_id: admin.id,
        sender_role: "admin",
        sender_name: admin.fullName,
        body,
      })
      .select("*")
      .single<SupportMessageRow>();

    if (error || !data) {
      setStatusMessage("Reply was not sent. Check your admin session and try again.");
      setIsSending(false);
      return;
    }

    setDraft("");
    setIsSending(false);
    setConversations((current) => mergeMessage(current, mapMessage(data)));
  }

  async function updateStatus(status: SupportConversation["status"]) {
    if (!activeConversation) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase
      .from("support_conversations")
      .update({ status })
      .eq("id", activeConversation.id);

    if (error) {
      setStatusMessage("Conversation status was not updated.");
      return;
    }

    setConversations((current) =>
      sortConversations(
        current.map((conversation) =>
          conversation.id === activeConversation.id
            ? { ...conversation, status }
            : conversation,
        ),
      ),
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-4">
        <div className="flex items-center justify-between gap-3 px-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              Inbox
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--color-ink)]">
              {openCount} open
            </h3>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
            <MessageCircle size={18} />
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {conversations.map((conversation) => {
            const latest = conversation.messages.at(-1);
            const isActive = activeConversation?.id === conversation.id;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  if (basePath) {
                    router.push(`${basePath}/${conversation.id}`);
                  }
                }}
                className={`w-full rounded-[1.3rem] border px-4 py-3 text-left ${
                  isActive
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-extrabold">
                    {conversation.customerName}
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      isActive
                        ? "bg-white/16 text-white"
                        : "bg-[var(--color-accent)] text-[var(--color-muted)]"
                    }`}
                  >
                    {conversation.status}
                  </span>
                </div>
                <p
                  className={`mt-1 truncate text-xs ${
                    isActive ? "text-white/72" : "text-[var(--color-muted)]"
                  }`}
                >
                  {conversation.subject}
                </p>
                {latest ? (
                  <p
                    className={`mt-2 truncate text-xs ${
                      isActive ? "text-white/72" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {latest.senderRole === "admin" ? "Admin: " : ""}
                    {latest.body}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>

      <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/92">
        {activeConversation ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-line)] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                  {activeConversation.subject}
                </p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                  {activeConversation.customerName}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {activeConversation.customerEmail || "No email on profile"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateStatus(
                    activeConversation.status === "closed" ? "open" : "closed",
                  )
                }
                className="ui-button ui-button-outline"
              >
                <CheckCircle2 size={16} />
                {activeConversation.status === "closed" ? "Reopen" : "Close"}
              </button>
            </div>

            <div ref={scrollRef} className="max-h-[32rem] space-y-3 overflow-y-auto px-5 py-5">
              {activeConversation.messages.length ? (
                activeConversation.messages.map((message) => {
                  const isAdmin = message.senderRole === "admin";

                  return (
                    <article
                      key={message.id}
                      className={`max-w-[82%] rounded-[1.3rem] px-4 py-3 text-sm leading-7 ${
                        isAdmin
                          ? "ml-auto bg-[var(--color-primary)] text-white"
                          : "mr-auto border border-[var(--color-line)] bg-[var(--color-accent)] text-[var(--color-ink)]"
                      }`}
                    >
                      <p className="font-semibold">{message.senderName}</p>
                      <p className="mt-1">{message.body}</p>
                      <p
                        className={`mt-2 text-[10px] font-semibold uppercase ${
                          isAdmin ? "text-white/64" : "text-[var(--color-muted)]"
                        }`}
                      >
                        {formatDateTime(message.createdAt)}
                      </p>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-[var(--color-line)] p-6 text-sm text-[var(--color-muted)]">
                  No messages in this conversation yet.
                </div>
              )}
            </div>

            {statusMessage ? (
              <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-800">
                {statusMessage}
              </div>
            ) : null}

            <form
              onSubmit={sendReply}
              className="grid gap-3 border-t border-[var(--color-line)] p-4 md:grid-cols-[1fr_auto]"
            >
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                rows={3}
                maxLength={2000}
                placeholder="Reply to this customer"
                className="resize-none rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="ui-button ui-button-primary self-stretch disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
                Send reply
              </button>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <MessageCircle size={28} className="mx-auto text-[var(--color-primary)]" />
            <h3 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
              No support conversations yet
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
              Customer support DMs will appear here as soon as signed-in customers start a chat.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}
