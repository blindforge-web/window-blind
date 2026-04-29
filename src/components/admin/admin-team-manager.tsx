"use client";

import { useActionState } from "react";
import {
  createAdminAccount,
  removeAdminAccess,
  updateAdminProfile,
} from "@/app/actions";
import { initialActionFeedbackState } from "@/lib/action-states";
import type { AdminIdentity, AdminProfile } from "@/lib/types";
import { formatDateTime, formatStatusLabel } from "@/lib/utils";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "orders", label: "Orders" },
  { value: "support", label: "Support" },
  { value: "content", label: "Content" },
  { value: "super_admin", label: "Super Admin" },
];

function Feedback({
  status,
  message,
}: {
  status: "idle" | "error" | "success";
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900"
      }`}
    >
      {message}
    </div>
  );
}

function AdminProfileEditor({
  profile,
  currentAdmin,
}: {
  profile: AdminProfile;
  currentAdmin: AdminIdentity;
}) {
  const [state, formAction] = useActionState(
    updateAdminProfile,
    initialActionFeedbackState,
  );
  const isSelf = profile.userId === currentAdmin.id;

  return (
    <article className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            {profile.email || "No email"}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">
            {profile.fullName}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {formatStatusLabel(profile.role)} ·{" "}
            {profile.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-extrabold uppercase text-[var(--color-primary)]">
          {isSelf ? "You" : "Admin"}
        </span>
      </div>

      <form action={formAction} className="mt-5 grid gap-4 lg:grid-cols-2">
        <input type="hidden" name="userId" value={profile.userId} />
        <label className="space-y-2">
          <span className="text-sm font-semibold">Full name</span>
          <input
            name="fullName"
            defaultValue={profile.fullName}
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Role</span>
          <select
            name="role"
            defaultValue={profile.role}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold lg:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={profile.isActive}
            disabled={isSelf}
          />
          Active admin access
        </label>

        <div className="text-xs leading-6 text-[var(--color-muted)] lg:col-span-2">
          Created {formatDateTime(profile.createdAt)}
          {profile.lastSignInAt
            ? ` · Last sign-in ${formatDateTime(profile.lastSignInAt)}`
            : ""}
        </div>

        <Feedback status={state.status} message={state.message} />

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button type="submit" className="ui-button ui-button-primary">
            Save admin
          </button>
          <button
            type="submit"
            formAction={removeAdminAccess}
            disabled={isSelf || !profile.isActive}
            className="ui-button ui-button-outline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove access
          </button>
        </div>
      </form>
    </article>
  );
}

export function AdminTeamManager({
  currentAdmin,
  profiles,
  serviceEnabled,
}: {
  currentAdmin: AdminIdentity;
  profiles: AdminProfile[];
  serviceEnabled: boolean;
}) {
  const [state, formAction] = useActionState(
    createAdminAccount,
    initialActionFeedbackState,
  );

  if (currentAdmin.role !== "super_admin") {
    return (
      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6 text-sm leading-7 text-[var(--color-muted)]">
        Only super admins can add, remove, or change admin roles.
      </section>
    );
  }

  if (!serviceEnabled) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
        Admin account management needs the Supabase service-role key on the server.
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Add admin
        </p>
        <form action={formAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Full name</span>
            <input
              name="fullName"
              required
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold">Password</span>
            <input
              name="password"
              type="password"
              minLength={8}
              placeholder="Required for new users"
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold">Role</span>
            <select
              name="role"
              defaultValue="admin"
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

          <div className="lg:col-span-2">
            <Feedback status={state.status} message={state.message} />
          </div>

          <div className="lg:col-span-2">
            <button type="submit" className="ui-button ui-button-primary">
              Add admin
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {profiles.map((profile) => (
          <AdminProfileEditor
            key={profile.userId}
            profile={profile}
            currentAdmin={currentAdmin}
          />
        ))}
      </section>
    </div>
  );
}
