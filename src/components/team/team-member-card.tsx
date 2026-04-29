/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { TeamMember } from "@/lib/types";
import { getInitials } from "@/lib/utils";

export function TeamMemberCard({
  member,
  compact = false,
}: {
  member: TeamMember;
  compact?: boolean;
}) {
  return (
    <article className="ui-panel flex h-full flex-col p-5 sm:p-6" id={member.id}>
      <div className="flex items-start gap-4">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="h-16 w-16 rounded-[1.25rem] border border-[var(--color-line)] object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(145deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_74%,white_26%))] text-lg font-extrabold tracking-[0.12em] text-white">
            {getInitials(member.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className="ui-pill ui-pill-solid">{member.role}</span>
          <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
            {member.name}
          </h3>
        </div>
      </div>

      {member.bio ? (
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">{member.bio}</p>
      ) : null}

      <div className="mt-auto pt-6">
        <Link
          href={compact ? `/team#${member.id}` : "/checkout/order"}
          className={compact ? "ui-button ui-button-outline w-full" : "ui-button ui-button-secondary w-full"}
        >
          {compact ? "View full profile" : "Start an order with Sunpilot"}
        </Link>
      </div>
    </article>
  );
}
