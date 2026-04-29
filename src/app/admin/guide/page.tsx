import { redirect } from "next/navigation";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/auth";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";

const workflows = [
  {
    title: "Order handling",
    items: [
      "Open Orders and start from Pending.",
      "Open the order detail page and review customer details, measurements, delivery state, amount, and receipt.",
      "Move the order to Paid after payment is confirmed.",
      "Move the order to Delivered only after fulfilment is complete.",
    ],
  },
  {
    title: "Support handling",
    items: [
      "Open Support and work from Open conversations first.",
      "Reply inside the customer conversation page.",
      "Close a conversation when the customer request has been resolved.",
      "Reopen a conversation if the customer sends another message.",
    ],
  },
  {
    title: "Product and delivery work",
    items: [
      "Use Products for product names, prices, descriptions, images, and listing status.",
      "Use Delivery for checkout coverage and state ETA details.",
      "Use Site Settings only for public website content, brand details, payment instructions, and contact channels.",
    ],
  },
];

const roles = [
  {
    role: "Super Admin",
    scope: "Full access, admin user management, password reset, products, orders, support, delivery, and site settings.",
  },
  {
    role: "Admin",
    scope: "General operations access across orders, support, products, delivery, and site settings.",
  },
  {
    role: "Orders",
    scope: "Order review, payment receipt checks, order status updates, and customer order follow-up.",
  },
  {
    role: "Support",
    scope: "Customer support messages, replies, and conversation closure.",
  },
  {
    role: "Content",
    scope: "Product content, public website content, navigation, gallery, team, and contact details.",
  },
];

export default async function AdminGuidePage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      admin={admin}
      active="guide"
      title="Admin work guide"
      subtitle="The operating guide for hired admins: where to go, what to check, and which role owns each task."
    >
      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <div className="space-y-5">
          {workflows.map((workflow) => (
            <article
              key={workflow.title}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                  <BookOpen size={19} />
                </span>
                <h2 className="text-2xl font-extrabold tracking-[-0.04em]">
                  {workflow.title}
                </h2>
              </div>
              <div className="mt-5 space-y-3">
                {workflow.items.map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-7 text-[var(--color-muted)]">
                    <CheckCircle2
                      size={17}
                      className="mt-1 shrink-0 text-[var(--color-primary)]"
                    />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Roles
          </p>
          <div className="mt-5 space-y-4">
            {roles.map((role) => (
              <div
                key={role.role}
                className="border-b border-[var(--color-line)] pb-4 last:border-0 last:pb-0"
              >
                <h3 className="text-lg font-extrabold">{role.role}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {role.scope}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </AdminShell>
  );
}
