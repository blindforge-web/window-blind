"use client";

import Link from "next/link";
import { Mail, MessageCircle, PhoneCall } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { buildTelHref, buildWhatsAppHref } from "@/lib/utils";

export function ContactActions({
  contact,
  message,
  className = "",
  includeSupport = true,
  includeEmail = false,
}: {
  contact: ContactInfo | null;
  message?: string;
  className?: string;
  includeSupport?: boolean;
  includeEmail?: boolean;
}) {
  const whatsappHref = buildWhatsAppHref(contact?.whatsappNumber || contact?.phone1, message);
  const primaryPhone = contact?.phone1 ?? "";
  const secondaryPhone = contact?.phone2 ?? "";
  const primaryTelHref = buildTelHref(primaryPhone);
  const secondaryTelHref = buildTelHref(secondaryPhone);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="ui-button ui-button-primary"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      ) : null}
      {primaryTelHref ? (
        <a href={primaryTelHref} className="ui-button ui-button-secondary">
          <PhoneCall size={16} />
          Call {primaryPhone}
        </a>
      ) : null}
      {secondaryTelHref ? (
        <a href={secondaryTelHref} className="ui-button ui-button-outline">
          <PhoneCall size={16} />
          Call {secondaryPhone}
        </a>
      ) : null}
      {includeEmail && contact?.email ? (
        <a href={`mailto:${contact.email}`} className="ui-button ui-button-outline">
          <Mail size={16} />
          Email
        </a>
      ) : null}
      {includeSupport ? (
        <Link href="/account?next=/" className="ui-button ui-button-outline">
          <MessageCircle size={16} />
          Live support
        </Link>
      ) : null}
    </div>
  );
}
