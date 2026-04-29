"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TeamMember } from "@/lib/types";
import { TeamMemberCard } from "@/components/team/team-member-card";

export function TeamCarousel({ members }: { members: TeamMember[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  function scrollByAmount(direction: "left" | "right") {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const amount = Math.max(viewport.clientWidth * 0.82, 280);
    viewport.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--color-muted)]">
          Slide sideways to meet the team.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            className="ui-icon-button"
            aria-label="Scroll team left"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            className="ui-icon-button"
            aria-label="Scroll team right"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {members.map((member) => (
          <div key={member.id} className="min-w-[18rem] max-w-[20rem] flex-[0_0_18rem] snap-start sm:min-w-[21rem] sm:flex-[0_0_21rem]">
            <TeamMemberCard member={member} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
