"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Headphones, MessageCircle, Minus, Send, X } from "lucide-react";
import { ContactActions } from "@/components/support/contact-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  ContactInfo,
  SupportConversation,
  SupportMessage,
  UserIdentity,
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

function mergeMessage(
  conversations: SupportConversation[],
  message: SupportMessage,
) {
  return conversations.map((conversation) => {
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
  });
}

export function LiveSupportWidget({
  currentUser,
  contact,
  initialConversations,
}: {
  currentUser: UserIdentity | null;
  contact: ContactInfo | null;
  initialConversations: SupportConversation[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversations[0]?.id ?? "",
  );
  const [subject, setSubject] = useState("Product enquiry");
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

  useEffect(() => {
    setConversations(initialConversations);
    setActiveConversationId(initialConversations[0]?.id ?? "");
  }, [initialConversations]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const channel = supabase
      .channel(`customer-support-${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_conversations",
        },
        (payload) => {
          const row = payload.new as SupportConversationRow | null;

          if (!row || row.customer_user_id !== currentUser.id) {
            return;
          }

          setConversations((current) => {
            const existing = current.find((item) => item.id === row.id);
            const mapped = mapConversation(row);

            if (!existing) {
              return [{ ...mapped, messages: [] }, ...current];
            }

            return current.map((item) =>
              item.id === row.id
                ? {
                    ...item,
                    subject: mapped.subject,
                    status: mapped.status,
                    lastMessageAt: mapped.lastMessageAt,
                  }
                : item,
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

          const message = mapMessage(row);
          setConversations((current) => mergeMessage(current, message));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!isOpen || isMinimized) {
      return;
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeConversation?.messages.length, isOpen, isMinimized]);

  async function getOrCreateConversation() {
    if (activeConversation) {
      return activeConversation;
    }

    if (!currentUser) {
      return null;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("support_conversations")
      .insert({
        customer_user_id: currentUser.id,
        customer_name: currentUser.fullName,
        customer_email: currentUser.email,
        subject: subject || "Support request",
      })
      .select("*")
      .single<SupportConversationRow>();

    if (error || !data) {
      throw new Error("Support chat could not be started.");
    }

    const conversation = mapConversation(data);
    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    return conversation;
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = draft.trim();

    if (!currentUser || !body || isSending) {
      return;
    }

    setIsSending(true);
    setStatusMessage("");

    try {
      const conversation = await getOrCreateConversation();
      const supabase = createSupabaseBrowserClient();

      if (!conversation || !supabase) {
        throw new Error("Support chat is not available right now.");
      }

      const { data, error } = await supabase
        .from("support_messages")
        .insert({
          conversation_id: conversation.id,
          sender_user_id: currentUser.id,
          sender_role: "customer",
          sender_name: currentUser.fullName,
          body,
        })
        .select("*")
        .single<SupportMessageRow>();

      if (error || !data) {
        throw new Error("Message was not sent.");
      }

      setDraft("");
      setConversations((current) => mergeMessage(current, mapMessage(data)));
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Support chat is not available right now.",
      );
    } finally {
      setIsSending(false);
    }
  }

  const latestMessage = conversations
    .flatMap((conversation) => conversation.messages)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )[0];

  return (
    <div className="fixed bottom-24 right-4 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 lg:bottom-5">
      {isOpen ? (
        <section className="w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[1.8rem] border border-[var(--color-line)] bg-white shadow-[0_30px_90px_-42px_rgba(15,23,42,0.48)]">
          <div className="flex items-center justify-between gap-3 bg-[var(--color-primary)] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/14">
                <Headphones size={18} />
              </span>
              <div>
                <p className="text-sm font-extrabold">Sunpilot support</p>
                <p className="text-xs text-white/72">
                  {currentUser ? "Private customer chat" : "Contact the team"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized((value) => !value)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label={isMinimized ? "Expand support chat" : "Minimize support chat"}
              >
                <Minus size={17} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label="Close support chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {!isMinimized ? (
            <div className="max-h-[72vh] overflow-hidden">
              {currentUser ? (
                <div className="grid gap-0">
                  {conversations.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-line)] bg-[var(--color-accent)] px-4 py-3">
                      {conversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => setActiveConversationId(conversation.id)}
                          className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold ${
                            activeConversation?.id === conversation.id
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : "border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                          }`}
                        >
                          {conversation.subject}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {!activeConversation ? (
                    <div className="border-b border-[var(--color-line)] px-4 py-3">
                      <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                        Subject
                        <select
                          value={subject}
                          onChange={(event) => setSubject(event.currentTarget.value)}
                          className="rounded-2xl border border-[var(--color-line)] bg-white px-3 py-3 text-sm outline-none"
                        >
                          <option>Product enquiry</option>
                          <option>Measurement guidance</option>
                          <option>Offline payment help</option>
                          <option>Order support</option>
                        </select>
                      </label>
                    </div>
                  ) : null}

                  <div
                    ref={scrollRef}
                    className="max-h-80 min-h-64 space-y-3 overflow-y-auto bg-[rgba(248,250,252,0.72)] px-4 py-4"
                  >
                    {activeConversation?.messages.length ? (
                      activeConversation.messages.map((message) => {
                        const isCustomer = message.senderRole === "customer";

                        return (
                          <article
                            key={message.id}
                            className={`max-w-[86%] rounded-[1.2rem] px-4 py-3 text-sm leading-6 ${
                              isCustomer
                                ? "ml-auto bg-[var(--color-primary)] text-white"
                                : "mr-auto border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                            }`}
                          >
                            <p>{message.body}</p>
                            <p
                              className={`mt-2 text-[10px] font-semibold uppercase ${
                                isCustomer ? "text-white/64" : "text-[var(--color-muted)]"
                              }`}
                            >
                              {formatDateTime(message.createdAt)}
                            </p>
                          </article>
                        );
                      })
                    ) : (
                      <div className="rounded-[1.3rem] border border-[var(--color-line)] bg-white p-4 text-sm leading-7 text-[var(--color-muted)]">
                        Send a message and an admin can reply from the support inbox.
                      </div>
                    )}
                  </div>

                  {statusMessage ? (
                    <div className="border-t border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                      {statusMessage}
                    </div>
                  ) : null}

                  <form
                    onSubmit={sendMessage}
                    className="grid grid-cols-[1fr_auto] gap-2 border-t border-[var(--color-line)] p-3"
                  >
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.currentTarget.value)}
                      rows={2}
                      maxLength={2000}
                      placeholder="Type your message"
                      className="min-h-12 resize-none rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || isSending}
                      className="inline-flex h-full min-h-12 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send support message"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  <div className="rounded-[1.3rem] border border-[var(--color-line)] bg-[var(--color-accent)] p-4">
                    <p className="text-sm font-bold text-[var(--color-ink)]">
                      Sign in for private live chat with admins.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      You can still reach Sunpilot immediately by WhatsApp or phone.
                    </p>
                  </div>
                  <Link href="/account?next=/" className="ui-button ui-button-primary w-full">
                    Open account access
                  </Link>
                  <ContactActions
                    contact={contact}
                    message="Hello Sunpilot, I need support."
                    includeSupport={false}
                    className="grid"
                  />
                </div>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-[var(--color-primary)] px-5 py-4 text-sm font-extrabold text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.55)]"
      >
        <MessageCircle size={18} />
        Support
        {latestMessage?.senderRole === "admin" ? (
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-secondary)]" />
        ) : null}
      </button>
    </div>
  );
}
