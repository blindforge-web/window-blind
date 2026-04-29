"use client";

import { useState } from "react";
import { KeyRound, Sparkles, UserPlus } from "lucide-react";
import { CustomerSignInForm } from "@/components/account/customer-sign-in-form";
import { CustomerSignUpForm } from "@/components/account/customer-sign-up-form";

const modes = [
  {
    id: "sign-in",
    label: "Sign in",
    icon: KeyRound,
    title: "Return to your Sunpilot workspace",
    body: "Open your saved orders, receipts, notifications, and delivery progress from one customer area.",
  },
  {
    id: "sign-up",
    label: "Create account",
    icon: UserPlus,
    title: "Create a customer profile that feels useful",
    body: "Keep future orders, payment updates, and delivery tracking together instead of starting from scratch each time.",
  },
] as const;

export function AccountAccessPanel({
  redirectTo = "/account",
}: {
  redirectTo?: string;
}) {
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("sign-in");
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];
  const ActiveIcon = activeMode.icon;

  return (
    <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-4 shadow-[0_30px_70px_-42px_rgba(14,42,71,0.22)] sm:p-6">
      <div className="inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-accent)] p-1">
        {modes.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-[0_14px_24px_-18px_rgba(15,76,151,0.75)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.7rem] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_70%,white_30%))] p-6 text-white">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/12">
            <ActiveIcon size={20} />
          </span>
          <h3 className="mt-5 text-3xl font-extrabold tracking-[-0.05em]">{activeMode.title}</h3>
          <p className="mt-4 text-sm leading-7 text-white/80">{activeMode.body}</p>
          <div className="mt-6 space-y-3">
            {[
              "View order IDs and tracking slugs in one place.",
              "See payment and delivery notifications without calling first.",
              "Move from account to products or orders in one tap.",
            ].map((item) => (
              <div key={item} className="rounded-[1.1rem] border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/84">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Customer access
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                This is still real authentication, just presented like a polished customer entry flow instead of a plain page of forms.
              </p>
            </div>
          </div>

          <div className="mt-6">
            {mode === "sign-in" ? (
              <CustomerSignInForm redirectTo={redirectTo} />
            ) : (
              <CustomerSignUpForm redirectTo={redirectTo} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
