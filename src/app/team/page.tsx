import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { getTeamMembers } from "@/lib/data";

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="ui-panel-soft p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="ui-section-label">Team</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                Meet the Sunpilot team behind every order.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                Meet the people who guide product selection, coordinate fabrication, support delivery, and help customers prepare for installation.
              </p>
            </div>
            <Link href="/checkout/order" className="ui-button ui-button-secondary">
              Start an order
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {teamMembers.length ? (
          <section className="grid gap-5 lg:grid-cols-2">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </section>
        ) : (
          <section className="ui-panel p-8 text-center">
            <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
              No team members are published yet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Add team members from the admin workspace and they will appear here automatically.
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
