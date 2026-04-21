import { redirect } from "next/navigation";
import {
  deleteClient,
  deleteGalleryItem,
  deleteHighlight,
  deleteNavbarItem,
  deleteService,
  deleteSocialLink,
  deleteTeamMember,
  saveContactInfo,
  saveSiteSection,
  saveSiteSettings,
  upsertClient,
  upsertGalleryItem,
  upsertHighlight,
  upsertNavbarItem,
  upsertService,
  upsertSocialLink,
  upsertTeamMember,
} from "@/app/actions";
import { CreateProductPanel } from "@/components/admin/create-product-panel";
import { DeliveryStateCard } from "@/components/admin/delivery-state-card";
import { PaymentAccountPanel } from "@/components/admin/payment-account-panel";
import { ProductAdminCard } from "@/components/admin/product-admin-card";
import { OrderAdminRow } from "@/components/admin/order-admin-row";
import { OrdersRealtimeRefresh } from "@/components/admin/orders-realtime-refresh";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type { SiteSection } from "@/lib/types";
import { formatCompactNumber } from "@/lib/utils";

const editableSections = [
  "hero",
  "about",
  "services",
  "reliability",
  "gallery",
  "team",
  "clients",
  "booking",
  "contact",
] as const;

function PanelHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl leading-none">{title}</h2>
      {body ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function Preview({
  url,
  label,
  kind = "image",
}: {
  url?: string | null;
  label: string;
  kind?: "image" | "video";
}) {
  if (!url) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">
      {kind === "video" ? (
        <video src={url} controls className="h-40 w-full object-cover" />
      ) : (
        <img src={url} alt={label} className="h-40 w-full object-cover" />
      )}
    </div>
  );
}

function SectionForm({ section }: { section?: SiteSection }) {
  if (!section) {
    return null;
  }

  return (
    <form
      action={saveSiteSection}
      className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
    >
      <input type="hidden" name="sectionKey" value={section.key} />
      <input type="hidden" name="currentMediaUrl" value={section.mediaUrl ?? ""} />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
            {section.key}
          </p>
          <h3 className="font-display text-3xl leading-none">{section.title}</h3>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="isActive" defaultChecked={section.isActive} />
          Active
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Eyebrow</span>
          <input
            name="eyebrow"
            defaultValue={section.eyebrow ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Title</span>
          <input
            name="title"
            defaultValue={section.title}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Subtitle</span>
          <textarea
            name="subtitle"
            rows={3}
            defaultValue={section.subtitle ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Body</span>
          <textarea
            name="body"
            rows={4}
            defaultValue={section.body ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Primary CTA label</span>
          <input
            name="primaryCtaLabel"
            defaultValue={section.primaryCtaLabel ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Primary CTA link</span>
          <input
            name="primaryCtaLink"
            defaultValue={section.primaryCtaLink ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Secondary CTA label</span>
          <input
            name="secondaryCtaLabel"
            defaultValue={section.secondaryCtaLabel ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Secondary CTA link</span>
          <input
            name="secondaryCtaLink"
            defaultValue={section.secondaryCtaLink ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Media type</span>
          <select
            name="mediaKind"
            defaultValue={section.mediaKind}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Media alt</span>
          <input
            name="mediaAlt"
            defaultValue={section.mediaAlt ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Media URL</span>
          <input
            name="mediaUrl"
            defaultValue=""
            placeholder={section.mediaUrl ?? ""}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Upload media</span>
          <input
            type="file"
            name="mediaFile"
            accept="image/*,video/*"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm"
          />
        </label>

        <label className="flex items-center gap-2 self-end text-sm font-semibold">
          <input type="checkbox" name="removeMedia" />
          Remove current media
        </label>
      </div>

      <div className="mt-4">
        <Preview url={section.mediaUrl} label={section.title} kind={section.mediaKind} />
      </div>

      <button
        type="submit"
        className="mt-5 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
      >
        Save section
      </button>
    </form>
  );
}

export default async function AdminDashboardPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const dashboard = await getAdminDashboardData();
  const actionsEnabled = Boolean(admin);
  const pendingOrders = dashboard.orders.filter(
    (order) => order.status !== "completed",
  ).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {actionsEnabled ? <OrdersRealtimeRefresh /> : null}

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-10">
        <section className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              Admin Dashboard
            </p>
            <h1 className="mt-2 font-display text-6xl leading-none">
              Sunpilot content and booking control
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              This dashboard manages the live landing page, storage-backed media,
              and realtime booking queue from the existing Next.js and Supabase
              architecture.
            </p>
          </div>
          {admin ? <SignOutButton /> : null}
        </section>

        {!hasPublicSupabaseConfig ? (
          <div className="rounded-[1.8rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Supabase environment values are missing. The dashboard shell is
            visible, but live authentication and content management are disabled
            until the public Supabase keys are configured.
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Services", formatCompactNumber(dashboard.services.length)],
            ["Team Members", formatCompactNumber(dashboard.teamMembers.length)],
            ["Clients", formatCompactNumber(dashboard.clients.length)],
            ["Open Orders", formatCompactNumber(pendingOrders)],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/90 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                {label}
              </p>
              <p className="mt-3 font-display text-4xl">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
            <PanelHeading
              eyebrow="Branding"
              title="Site settings and theme"
              body="These values drive the brand name, color system, tagline, footer note, and optional logo across the public site."
            />

            <form action={saveSiteSettings} className="grid gap-4 lg:grid-cols-2">
              <input
                type="hidden"
                name="currentLogoUrl"
                value={dashboard.settings?.logoUrl ?? ""}
              />

              <label className="space-y-2">
                <span className="text-sm font-semibold">Brand name</span>
                <input
                  name="brandName"
                  defaultValue={dashboard.settings?.brandName ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Short name</span>
                <input
                  name="shortName"
                  defaultValue={dashboard.settings?.shortName ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-semibold">Tagline</span>
                <textarea
                  name="tagline"
                  rows={3}
                  defaultValue={dashboard.settings?.tagline ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-semibold">Footer note</span>
                <textarea
                  name="footerNote"
                  rows={4}
                  defaultValue={dashboard.settings?.footerNote ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-sm font-semibold">Logo URL</span>
                <input
                  name="logoUrl"
                  defaultValue=""
                  placeholder={dashboard.settings?.logoUrl ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Upload logo</span>
                <input
                  type="file"
                  name="logoFile"
                  accept="image/*"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                />
              </label>

              <label className="flex items-center gap-2 self-end text-sm font-semibold">
                <input type="checkbox" name="removeLogo" disabled={!actionsEnabled} />
                Remove current logo
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Primary color</span>
                <input
                  name="primaryColor"
                  defaultValue={dashboard.settings?.primaryColor ?? "#0A2540"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Secondary color</span>
                <input
                  name="secondaryColor"
                  defaultValue={dashboard.settings?.secondaryColor ?? "#D4AF37"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Accent color</span>
                <input
                  name="accentColor"
                  defaultValue={dashboard.settings?.accentColor ?? "#F5F5F5"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Page color</span>
                <input
                  name="pageColor"
                  defaultValue={dashboard.settings?.pageColor ?? "#F5F7FA"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Surface color</span>
                <input
                  name="surfaceColor"
                  defaultValue={dashboard.settings?.surfaceColor ?? "#FFFFFF"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Ink color</span>
                <input
                  name="inkColor"
                  defaultValue={dashboard.settings?.inkColor ?? "#0F172A"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Muted color</span>
                <input
                  name="mutedColor"
                  defaultValue={dashboard.settings?.mutedColor ?? "#475569"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Line color</span>
                <input
                  name="lineColor"
                  defaultValue={dashboard.settings?.lineColor ?? "rgba(10, 37, 64, 0.12)"}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <div className="lg:col-span-2">
                <Preview url={dashboard.settings?.logoUrl} label="Logo" />
              </div>

              <button
                type="submit"
                disabled={!actionsEnabled}
                className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
              >
                Save site settings
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
            <PanelHeading
              eyebrow="Contact"
              title="Contact information"
              body="These values appear in the contact section and footer."
            />

            <form action={saveContactInfo} className="grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold">Phone 1</span>
                <input
                  name="phone1"
                  defaultValue={dashboard.contact?.phone1 ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Phone 2</span>
                <input
                  name="phone2"
                  defaultValue={dashboard.contact?.phone2 ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">WhatsApp number</span>
                <input
                  name="whatsappNumber"
                  defaultValue={dashboard.contact?.whatsappNumber ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Email</span>
                <input
                  name="email"
                  defaultValue={dashboard.contact?.email ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Address</span>
                <textarea
                  name="address"
                  rows={4}
                  defaultValue={dashboard.contact?.address ?? ""}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
              </label>

              <button
                type="submit"
                disabled={!actionsEnabled}
                className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save contact info
              </button>
            </form>
          </section>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Sections"
            title="Landing page section content"
            body="Every hero, about, services, gallery, team, clients, booking, and contact text block is editable here."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {editableSections.map((key) => (
              <SectionForm key={key} section={dashboard.sections[key]} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Navbar"
            title="Navigation items"
            body="These records control the public navigation labels and links."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.navigation.map((item) => (
              <form
                key={item.id}
                action={upsertNavbarItem}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-4">
                  <input
                    name="title"
                    defaultValue={item.title}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="link"
                    defaultValue={item.link}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save item
                    </button>
                    <button
                      type="submit"
                      formAction={deleteNavbarItem}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertNavbarItem}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add navigation item</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="title"
                  placeholder="Contact"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="link"
                  placeholder="/#contact"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.navigation.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add navigation item
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Highlights"
            title="Why choose us cards"
            body="These cards feed the reliability section on the landing page."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.highlights.map((item) => (
              <form
                key={item.id}
                action={upsertHighlight}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-4">
                  <input
                    name="title"
                    defaultValue={item.title}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={item.description}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save highlight
                    </button>
                    <button
                      type="submit"
                      formAction={deleteHighlight}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertHighlight}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add highlight</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="title"
                  placeholder="Clear production workflow"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <textarea
                  name="description"
                  rows={4}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.highlights.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add highlight
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Landing Services"
            title="Service cards"
            body="These cards describe service categories on the landing page and support image uploads."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.services.map((item) => (
              <form
                key={item.id}
                action={upsertService}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="currentImageUrl" value={item.imageUrl ?? ""} />
                <div className="grid gap-4">
                  <input
                    name="title"
                    defaultValue={item.title}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={item.description}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="imageUrl"
                    defaultValue=""
                    placeholder={item.imageUrl ?? "Direct image URL"}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" name="removeMedia" disabled={!actionsEnabled} />
                    Remove current image
                  </label>
                  <Preview url={item.imageUrl} label={item.title} />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save service
                    </button>
                    <button
                      type="submit"
                      formAction={deleteService}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertService}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add service card</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="title"
                  placeholder="Installation support"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <textarea
                  name="description"
                  rows={4}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="imageUrl"
                  placeholder="Direct image URL"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.services.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add service card
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Team"
            title="Team member cards"
            body="Admins can update names, roles, bios, and profile photos from here."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.teamMembers.map((item) => (
              <form
                key={item.id}
                action={upsertTeamMember}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="currentImageUrl" value={item.imageUrl ?? ""} />
                <div className="grid gap-4">
                  <input
                    name="name"
                    defaultValue={item.name}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="role"
                    defaultValue={item.role}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <textarea
                    name="bio"
                    rows={4}
                    defaultValue={item.bio ?? ""}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="imageUrl"
                    defaultValue=""
                    placeholder={item.imageUrl ?? "Direct image URL"}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" name="removeMedia" disabled={!actionsEnabled} />
                    Remove current photo
                  </label>
                  <Preview url={item.imageUrl} label={item.name} />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save team member
                    </button>
                    <button
                      type="submit"
                      formAction={deleteTeamMember}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertTeamMember}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add team member</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="name"
                  placeholder="Full name"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="role"
                  placeholder="Role"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <textarea
                  name="bio"
                  rows={4}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="imageUrl"
                  placeholder="Direct image URL"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.teamMembers.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add team member
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Clients"
            title="Client and partner logos"
            body="Client names, logos, links, and ordering are all editable here."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.clients.map((item) => (
              <form
                key={item.id}
                action={upsertClient}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="currentLogoUrl" value={item.logoUrl ?? ""} />
                <div className="grid gap-4">
                  <input
                    name="name"
                    defaultValue={item.name}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="websiteUrl"
                    defaultValue={item.websiteUrl ?? ""}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="logoUrl"
                    defaultValue=""
                    placeholder={item.logoUrl ?? "Direct logo URL"}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="file"
                    name="logoFile"
                    accept="image/*"
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" name="removeLogo" disabled={!actionsEnabled} />
                    Remove current logo
                  </label>
                  <Preview url={item.logoUrl} label={item.name} />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save client
                    </button>
                    <button
                      type="submit"
                      formAction={deleteClient}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertClient}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add client</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="name"
                  placeholder="Client name"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="websiteUrl"
                  placeholder="https://example.com"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="logoUrl"
                  placeholder="Direct logo URL"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="file"
                  name="logoFile"
                  accept="image/*"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.clients.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add client
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Gallery"
            title="Gallery media"
            body="Admins can manage showcase images and videos used on the landing page."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.galleryItems.map((item) => (
              <form
                key={item.id}
                action={upsertGalleryItem}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="currentMediaUrl" value={item.mediaUrl ?? ""} />
                <div className="grid gap-4">
                  <input
                    name="title"
                    defaultValue={item.title}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={item.description ?? ""}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <select
                    name="mediaKind"
                    defaultValue={item.mediaKind}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input
                    name="mediaUrl"
                    defaultValue=""
                    placeholder={item.mediaUrl ?? "Direct media URL"}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="file"
                    name="mediaFile"
                    accept="image/*,video/*"
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" name="removeMedia" disabled={!actionsEnabled} />
                    Remove current media
                  </label>
                  <Preview url={item.mediaUrl} label={item.title} kind={item.mediaKind} />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save gallery item
                    </button>
                    <button
                      type="submit"
                      formAction={deleteGalleryItem}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertGalleryItem}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add gallery item</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="title"
                  placeholder="Project spotlight"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <textarea
                  name="description"
                  rows={4}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <select
                  name="mediaKind"
                  defaultValue="image"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input
                  name="mediaUrl"
                  placeholder="Direct media URL"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="file"
                  name="mediaFile"
                  accept="image/*,video/*"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.galleryItems.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add gallery item
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Socials"
            title="Social links"
            body="Footer and contact social buttons are driven from these Supabase records."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.socialLinks.map((item) => (
              <form
                key={item.id}
                action={upsertSocialLink}
                className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
              >
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-4">
                  <input
                    name="platform"
                    defaultValue={item.platform}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="displayName"
                    defaultValue={item.displayName}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    name="url"
                    defaultValue={item.url}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={item.sortOrder}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={item.isActive}
                      disabled={!actionsEnabled}
                    />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!actionsEnabled}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Save social link
                    </button>
                    <button
                      type="submit"
                      formAction={deleteSocialLink}
                      disabled={!actionsEnabled}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            ))}

            <form
              action={upsertSocialLink}
              className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-5"
            >
              <h3 className="font-display text-3xl leading-none">Add social link</h3>
              <div className="mt-4 grid gap-4">
                <input
                  name="platform"
                  placeholder="instagram"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="displayName"
                  placeholder="Instagram"
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  name="url"
                  placeholder="https://instagram.com/..."
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={dashboard.socialLinks.length + 1}
                  disabled={!actionsEnabled}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Add social link
                </button>
              </div>
            </form>
          </div>
        </section>

        <CreateProductPanel actionsEnabled={actionsEnabled} />

        <PaymentAccountPanel
          paymentAccount={
            dashboard.paymentAccount ?? {
              bankName: "",
              accountName: "",
              accountNumber: "",
              note: "",
            }
          }
          actionsEnabled={actionsEnabled}
        />

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Catalog"
            title="Products and listing control"
            body="These controls keep the existing product catalog, slug pages, pricing, and public listing visibility intact."
          />

          {dashboard.products.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {dashboard.products.map((product) => (
                <ProductAdminCard
                  key={product.id}
                  product={product}
                  actionsEnabled={actionsEnabled}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-8">
              <h3 className="font-display text-4xl">No products created yet</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Use the product composer above to create the first blind listing.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Delivery"
            title="Delivery state coverage"
            body="The checkout flow still reads active delivery states from Supabase."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.deliveryStates.map((deliveryState) => (
              <DeliveryStateCard
                key={deliveryState.code}
                deliveryState={deliveryState}
                actionsEnabled={actionsEnabled}
              />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <PanelHeading
            eyebrow="Orders"
            title="Realtime booking queue"
            body="New bookings are written into Supabase and the dashboard refreshes when order rows change."
          />

          {dashboard.orders.length ? (
            <div className="space-y-4">
              {dashboard.orders.map((order) => (
                <OrderAdminRow
                  key={order.id}
                  order={order}
                  actionsEnabled={actionsEnabled}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-8">
              <h3 className="font-display text-4xl">No bookings yet</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Once visitors submit the booking form, their requests will appear
                here and can be updated from pending to completed.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
