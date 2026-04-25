/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
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
  savePaymentAccount,
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
import { SignOutButton } from "@/components/admin/sign-out-button";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type { GalleryItem, SiteSection } from "@/lib/types";

const sectionOrder = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "products", label: "Products" },
  { key: "services", label: "Services" },
  { key: "reliability", label: "Reliability" },
  { key: "gallery", label: "Gallery" },
  { key: "team", label: "Team" },
  { key: "clients", label: "Clients" },
  { key: "contact", label: "Contact" },
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
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{body}</p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  disabled: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  rows = 4,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  disabled: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        disabled={disabled}
        className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
      />
    </label>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
  disabled,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
  disabled: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} disabled={disabled} />
      {label}
    </label>
  );
}

function MediaFields({
  currentUrl,
  urlName,
  currentUrlName,
  fileName,
  removeName,
  disabled,
  label = "Current media",
}: {
  currentUrl?: string | null;
  urlName: string;
  currentUrlName: string;
  fileName: string;
  removeName: string;
  disabled: boolean;
  label?: string;
}) {
  return (
    <div className="space-y-3 lg:col-span-2">
      <input type="hidden" name={currentUrlName} value={currentUrl ?? ""} />
      {currentUrl ? (
        <div className="overflow-hidden rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-accent)]">
          <div className="border-b border-[var(--color-line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            {label}
          </div>
          <img src={currentUrl} alt={label} className="h-48 w-full object-cover" />
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Direct media URL"
          name={urlName}
          placeholder={currentUrl || "https://..."}
          disabled={disabled}
        />
        <label className="space-y-2">
          <span className="text-sm font-semibold">Upload media file</span>
          <input
            type="file"
            name={fileName}
            accept="image/*,video/*"
            disabled={disabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
          />
        </label>
      </div>
      <Toggle
        label="Remove current media"
        name={removeName}
        defaultChecked={false}
        disabled={disabled}
      />
    </div>
  );
}

function GalleryCard({
  item,
  actionsEnabled,
}: {
  item?: GalleryItem;
  actionsEnabled: boolean;
}) {
  const isNew = !item;

  return (
    <form
      action={upsertGalleryItem}
      className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5"
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <PanelHeading
        eyebrow={isNew ? "New gallery item" : "Gallery item"}
        title={isNew ? "Add gallery media" : item.title}
        body="This controls the optional project gallery section on the public site."
      />
      <div className="grid gap-4">
        <Field label="Title" name="title" defaultValue={item?.title} disabled={!actionsEnabled} />
        <TextareaField
          label="Description"
          name="description"
          defaultValue={item?.description}
          rows={3}
          disabled={!actionsEnabled}
        />
        <label className="space-y-2">
          <span className="text-sm font-semibold">Media type</span>
          <select
            name="mediaKind"
            defaultValue={item?.mediaKind ?? "image"}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={item?.sortOrder ?? 1}
          disabled={!actionsEnabled}
        />
        <MediaFields
          currentUrl={item?.mediaUrl}
          urlName="mediaUrl"
          currentUrlName="currentMediaUrl"
          fileName="mediaFile"
          removeName="removeMedia"
          disabled={!actionsEnabled}
        />
        <Toggle
          label="Visible on site"
          name="isActive"
          defaultChecked={item?.isActive ?? true}
          disabled={!actionsEnabled}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!actionsEnabled}
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isNew ? "Add gallery item" : "Save gallery item"}
          </button>
          {!isNew ? (
            <button
              type="submit"
              formAction={deleteGalleryItem}
              disabled={!actionsEnabled}
              className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 disabled:opacity-60"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}

export default async function AdminSiteSettingsPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const dashboard = await getAdminDashboardData();
  const actionsEnabled = Boolean(admin);
  const settings = dashboard.settings ?? {
    brandName: "",
    shortName: "",
    tagline: "",
    logoUrl: null,
    footerNote: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    paymentNote: "",
    primaryColor: "#0A2540",
    secondaryColor: "#D4AF37",
    accentColor: "#F5F5F5",
    pageColor: "#F5F7FA",
    surfaceColor: "#FFFFFF",
    inkColor: "#0F172A",
    mutedColor: "#475569",
    lineColor: "rgba(10, 37, 64, 0.12)",
  };

  const contact = dashboard.contact ?? {
    phone1: "",
    phone2: "",
    whatsappNumber: "",
    email: "",
    address: "",
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-10">
        <section className="rounded-[2.7rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Admin Site Settings
              </p>
              <h1 className="mt-2 font-display text-6xl leading-none">
                Manage public-site content and branding
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                This is the separate screen for the public site. It exposes the editable
                Supabase-backed content, including logo, section media, service images, team
                images, navigation, social links, gallery, and client items.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/dashboard"
                className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Back to dashboard
              </Link>
              {admin ? <SignOutButton /> : null}
            </div>
          </div>
        </section>

        {!hasPublicSupabaseConfig ? (
          <div className="rounded-[1.8rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Supabase environment values are missing. The settings screen is visible, but live
            editing is disabled until the public keys are configured.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-4 lg:sticky lg:top-24">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Settings Areas
            </p>
            <nav className="mt-3 space-y-2 text-sm font-semibold text-[var(--color-ink)]">
              {[
                ["branding", "Branding"],
                ["contact", "Contact and payment"],
                ["navigation", "Navigation and socials"],
                ["sections", "Page sections"],
                ["highlights", "Highlights"],
                ["services", "Services"],
                ["team", "Team"],
                ["clients", "Clients"],
                ["gallery", "Gallery"],
              ].map(([key, label]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="block rounded-2xl border border-[var(--color-line)] bg-white px-3 py-3"
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-8">
            <section
              id="branding"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Branding"
                title="Site identity and colour system"
                body="This is the main site settings form. It controls the public brand, logo, footer note, and theme colours."
              />
              <form action={saveSiteSettings} className="grid gap-4 lg:grid-cols-2">
                <Field
                  label="Brand name"
                  name="brandName"
                  defaultValue={settings.brandName}
                  disabled={!actionsEnabled}
                />
                <Field
                  label="Short name"
                  name="shortName"
                  defaultValue={settings.shortName}
                  disabled={!actionsEnabled}
                />
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-semibold">Tagline</span>
                  <input
                    name="tagline"
                    defaultValue={settings.tagline}
                    disabled={!actionsEnabled}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                  />
                </label>
                <TextareaField
                  label="Footer note"
                  name="footerNote"
                  defaultValue={settings.footerNote}
                  rows={4}
                  disabled={!actionsEnabled}
                />
                <div className="grid gap-4">
                  <Field
                    label="Primary colour"
                    name="primaryColor"
                    defaultValue={settings.primaryColor}
                    disabled={!actionsEnabled}
                  />
                  <Field
                    label="Secondary colour"
                    name="secondaryColor"
                    defaultValue={settings.secondaryColor}
                    disabled={!actionsEnabled}
                  />
                </div>
                <Field
                  label="Accent colour"
                  name="accentColor"
                  defaultValue={settings.accentColor}
                  disabled={!actionsEnabled}
                />
                <Field
                  label="Page colour"
                  name="pageColor"
                  defaultValue={settings.pageColor}
                  disabled={!actionsEnabled}
                />
                <Field
                  label="Surface colour"
                  name="surfaceColor"
                  defaultValue={settings.surfaceColor}
                  disabled={!actionsEnabled}
                />
                <Field
                  label="Ink colour"
                  name="inkColor"
                  defaultValue={settings.inkColor}
                  disabled={!actionsEnabled}
                />
                <Field
                  label="Muted colour"
                  name="mutedColor"
                  defaultValue={settings.mutedColor}
                  disabled={!actionsEnabled}
                />
                <Field
                  label="Line colour"
                  name="lineColor"
                  defaultValue={settings.lineColor}
                  disabled={!actionsEnabled}
                />
                <MediaFields
                  currentUrl={settings.logoUrl}
                  urlName="logoUrl"
                  currentUrlName="currentLogoUrl"
                  fileName="logoFile"
                  removeName="removeLogo"
                  label="Current logo"
                  disabled={!actionsEnabled}
                />
                <button
                  type="submit"
                  disabled={!actionsEnabled}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 lg:col-span-2"
                >
                  Save site settings
                </button>
              </form>
            </section>

            <section id="contact" className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
                <PanelHeading
                  eyebrow="Contact"
                  title="Business contact details"
                  body="Keep phone numbers, email, and address current so the public site stays accurate."
                />
                <form action={saveContactInfo} className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="Primary phone"
                    name="phone1"
                    defaultValue={contact.phone1}
                    disabled={!actionsEnabled}
                  />
                  <Field
                    label="Alternate phone"
                    name="phone2"
                    defaultValue={contact.phone2}
                    disabled={!actionsEnabled}
                  />
                  <Field
                    label="WhatsApp number"
                    name="whatsappNumber"
                    defaultValue={contact.whatsappNumber}
                    disabled={!actionsEnabled}
                  />
                  <Field
                    label="Email"
                    name="email"
                    defaultValue={contact.email}
                    disabled={!actionsEnabled}
                  />
                  <div className="lg:col-span-2">
                    <TextareaField
                      label="Address"
                      name="address"
                      defaultValue={contact.address}
                      rows={3}
                      disabled={!actionsEnabled}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!actionsEnabled}
                    className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 lg:col-span-2"
                  >
                    Save contact details
                  </button>
                </form>
              </section>

              <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
                <PanelHeading
                  eyebrow="Payment"
                  title="Transfer account details"
                  body="These fields are seeded in `site_settings` and are used on the checkout flow."
                />
                <form action={savePaymentAccount} className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="Bank name"
                    name="bankName"
                    defaultValue={settings.bankName}
                    disabled={!actionsEnabled}
                  />
                  <Field
                    label="Account name"
                    name="accountName"
                    defaultValue={settings.accountName}
                    disabled={!actionsEnabled}
                  />
                  <Field
                    label="Account number"
                    name="accountNumber"
                    defaultValue={settings.accountNumber}
                    disabled={!actionsEnabled}
                  />
                  <div className="lg:col-span-2">
                    <TextareaField
                      label="Payment note"
                      name="paymentNote"
                      defaultValue={settings.paymentNote}
                      rows={4}
                      disabled={!actionsEnabled}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!actionsEnabled}
                    className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 lg:col-span-2"
                  >
                    Save payment account
                  </button>
                </form>
              </section>
            </section>

            <section
              id="navigation"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Navigation"
                title="Navbar and social links"
                body="These control the public navigation and footer/header social buttons."
              />
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold">Navbar items</h3>
                  {dashboard.navigation.map((item) => (
                    <form
                      key={item.id}
                      action={upsertNavbarItem}
                      className="rounded-[1.6rem] border border-[var(--color-line)] bg-white p-4"
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4">
                        <Field label="Title" name="title" defaultValue={item.title} disabled={!actionsEnabled} />
                        <Field label="Link" name="link" defaultValue={item.link} disabled={!actionsEnabled} />
                        <Field
                          label="Sort order"
                          name="sortOrder"
                          type="number"
                          defaultValue={item.sortOrder}
                          disabled={!actionsEnabled}
                        />
                        <Toggle label="Visible on site" name="isActive" defaultChecked={item.isActive} disabled={!actionsEnabled} />
                        <div className="flex flex-wrap gap-3">
                          <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                            Save item
                          </button>
                          <button type="submit" formAction={deleteNavbarItem} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                            Delete
                          </button>
                        </div>
                      </div>
                    </form>
                  ))}
                  <form action={upsertNavbarItem} className="rounded-[1.6rem] border border-dashed border-[var(--color-line)] bg-white p-4">
                    <h4 className="text-lg font-extrabold">Add navbar item</h4>
                    <div className="mt-4 grid gap-4">
                      <Field label="Title" name="title" disabled={!actionsEnabled} />
                      <Field label="Link" name="link" disabled={!actionsEnabled} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={dashboard.navigation.length + 1} disabled={!actionsEnabled} />
                      <Toggle label="Visible on site" name="isActive" defaultChecked disabled={!actionsEnabled} />
                      <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        Add item
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold">Social links</h3>
                  {dashboard.socialLinks.map((item) => (
                    <form
                      key={item.id}
                      action={upsertSocialLink}
                      className="rounded-[1.6rem] border border-[var(--color-line)] bg-white p-4"
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4">
                        <Field label="Platform" name="platform" defaultValue={item.platform} disabled={!actionsEnabled} />
                        <Field label="Display name" name="displayName" defaultValue={item.displayName} disabled={!actionsEnabled} />
                        <Field label="URL" name="url" defaultValue={item.url} disabled={!actionsEnabled} />
                        <Field label="Sort order" name="sortOrder" type="number" defaultValue={item.sortOrder} disabled={!actionsEnabled} />
                        <Toggle label="Visible on site" name="isActive" defaultChecked={item.isActive} disabled={!actionsEnabled} />
                        <div className="flex flex-wrap gap-3">
                          <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                            Save link
                          </button>
                          <button type="submit" formAction={deleteSocialLink} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                            Delete
                          </button>
                        </div>
                      </div>
                    </form>
                  ))}
                  <form action={upsertSocialLink} className="rounded-[1.6rem] border border-dashed border-[var(--color-line)] bg-white p-4">
                    <h4 className="text-lg font-extrabold">Add social link</h4>
                    <div className="mt-4 grid gap-4">
                      <Field label="Platform" name="platform" disabled={!actionsEnabled} />
                      <Field label="Display name" name="displayName" disabled={!actionsEnabled} />
                      <Field label="URL" name="url" disabled={!actionsEnabled} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={dashboard.socialLinks.length + 1} disabled={!actionsEnabled} />
                      <Toggle label="Visible on site" name="isActive" defaultChecked disabled={!actionsEnabled} />
                      <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        Add link
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            <section
              id="sections"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Sections"
                title="Homepage and landing sections"
                body="Each section here maps to `site_sections`, including image and video media fields."
              />
              <div className="space-y-6">
                {sectionOrder.map((entry) => {
                  const section = dashboard.sections[entry.key] as SiteSection | undefined;
                  return (
                    <form
                      key={entry.key}
                      action={saveSiteSection}
                      className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5"
                    >
                      <input type="hidden" name="sectionKey" value={entry.key} />
                      <PanelHeading
                        eyebrow="Section"
                        title={entry.label}
                        body={`Edit the public ${entry.label.toLowerCase()} block and its media.`}
                      />
                      <div className="grid gap-4 lg:grid-cols-2">
                        <Field
                          label="Eyebrow"
                          name="eyebrow"
                          defaultValue={section?.eyebrow}
                          disabled={!actionsEnabled}
                        />
                        <Field
                          label="Title"
                          name="title"
                          defaultValue={section?.title}
                          disabled={!actionsEnabled}
                        />
                        <div className="lg:col-span-2">
                          <TextareaField
                            label="Subtitle"
                            name="subtitle"
                            defaultValue={section?.subtitle}
                            rows={3}
                            disabled={!actionsEnabled}
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <TextareaField
                            label="Body"
                            name="body"
                            defaultValue={section?.body}
                            rows={4}
                            disabled={!actionsEnabled}
                          />
                        </div>
                        <Field
                          label="Primary CTA label"
                          name="primaryCtaLabel"
                          defaultValue={section?.primaryCtaLabel}
                          disabled={!actionsEnabled}
                        />
                        <Field
                          label="Primary CTA link"
                          name="primaryCtaLink"
                          defaultValue={section?.primaryCtaLink}
                          disabled={!actionsEnabled}
                        />
                        <Field
                          label="Secondary CTA label"
                          name="secondaryCtaLabel"
                          defaultValue={section?.secondaryCtaLabel}
                          disabled={!actionsEnabled}
                        />
                        <Field
                          label="Secondary CTA link"
                          name="secondaryCtaLink"
                          defaultValue={section?.secondaryCtaLink}
                          disabled={!actionsEnabled}
                        />
                        <label className="space-y-2">
                          <span className="text-sm font-semibold">Media type</span>
                          <select
                            name="mediaKind"
                            defaultValue={section?.mediaKind ?? "image"}
                            disabled={!actionsEnabled}
                            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </label>
                        <Field
                          label="Media alt text"
                          name="mediaAlt"
                          defaultValue={section?.mediaAlt}
                          disabled={!actionsEnabled}
                        />
                        <MediaFields
                          currentUrl={section?.mediaUrl}
                          urlName="mediaUrl"
                          currentUrlName="currentMediaUrl"
                          fileName="mediaFile"
                          removeName="removeMedia"
                          disabled={!actionsEnabled}
                        />
                        <Toggle
                          label="Visible on site"
                          name="isActive"
                          defaultChecked={section?.isActive ?? true}
                          disabled={!actionsEnabled}
                        />
                        <button
                          type="submit"
                          disabled={!actionsEnabled}
                          className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 lg:col-span-2"
                        >
                          Save {entry.label} section
                        </button>
                      </div>
                    </form>
                  );
                })}
              </div>
            </section>

            <section
              id="highlights"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Highlights"
                title="Site highlight cards"
                body="These map to the homepage highlight blocks."
              />
              <div className="grid gap-4 xl:grid-cols-2">
                {dashboard.highlights.map((item) => (
                  <form
                    key={item.id}
                    action={upsertHighlight}
                    className="rounded-[1.6rem] border border-[var(--color-line)] bg-white p-4"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-4">
                      <Field label="Title" name="title" defaultValue={item.title} disabled={!actionsEnabled} />
                      <TextareaField label="Description" name="description" defaultValue={item.description} rows={4} disabled={!actionsEnabled} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={item.sortOrder} disabled={!actionsEnabled} />
                      <Toggle label="Visible on site" name="isActive" defaultChecked={item.isActive} disabled={!actionsEnabled} />
                      <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                          Save highlight
                        </button>
                        <button type="submit" formAction={deleteHighlight} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                          Delete
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
                <form action={upsertHighlight} className="rounded-[1.6rem] border border-dashed border-[var(--color-line)] bg-white p-4">
                  <h3 className="text-lg font-extrabold">Add highlight</h3>
                  <div className="mt-4 grid gap-4">
                    <Field label="Title" name="title" disabled={!actionsEnabled} />
                    <TextareaField label="Description" name="description" rows={4} disabled={!actionsEnabled} />
                    <Field label="Sort order" name="sortOrder" type="number" defaultValue={dashboard.highlights.length + 1} disabled={!actionsEnabled} />
                    <Toggle label="Visible on site" name="isActive" defaultChecked disabled={!actionsEnabled} />
                    <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      Add highlight
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section
              id="services"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Services"
                title="Service cards with editable images"
                body="This addresses the missing service-image editing problem shown in your screenshot."
              />
              <div className="grid gap-5 xl:grid-cols-2">
                {dashboard.services.map((service) => (
                  <form
                    key={service.id}
                    action={upsertService}
                    className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5"
                  >
                    <input type="hidden" name="id" value={service.id} />
                    <div className="grid gap-4">
                      <Field label="Title" name="title" defaultValue={service.title} disabled={!actionsEnabled} />
                      <TextareaField label="Description" name="description" defaultValue={service.description} rows={4} disabled={!actionsEnabled} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={service.sortOrder} disabled={!actionsEnabled} />
                      <MediaFields
                        currentUrl={service.imageUrl}
                        urlName="imageUrl"
                        currentUrlName="currentImageUrl"
                        fileName="imageFile"
                        removeName="removeMedia"
                        label="Current service image"
                        disabled={!actionsEnabled}
                      />
                      <Toggle label="Visible on site" name="isActive" defaultChecked={service.isActive} disabled={!actionsEnabled} />
                      <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                          Save service
                        </button>
                        <button type="submit" formAction={deleteService} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                          Delete
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
                <form action={upsertService} className="rounded-[1.8rem] border border-dashed border-[var(--color-line)] bg-white p-5">
                  <h3 className="text-xl font-extrabold">Add service</h3>
                  <div className="mt-4 grid gap-4">
                    <Field label="Title" name="title" disabled={!actionsEnabled} />
                    <TextareaField label="Description" name="description" rows={4} disabled={!actionsEnabled} />
                    <Field label="Sort order" name="sortOrder" type="number" defaultValue={dashboard.services.length + 1} disabled={!actionsEnabled} />
                    <MediaFields
                      currentUrl={null}
                      urlName="imageUrl"
                      currentUrlName="currentImageUrl"
                      fileName="imageFile"
                      removeName="removeMedia"
                      label="Service image"
                      disabled={!actionsEnabled}
                    />
                    <Toggle label="Visible on site" name="isActive" defaultChecked disabled={!actionsEnabled} />
                    <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      Add service
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section
              id="team"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Team"
                title="Team members with editable images"
                body="This gives admins a direct UI for the team images and copy shown on the public site."
              />
              <div className="grid gap-5 xl:grid-cols-2">
                {dashboard.teamMembers.map((member) => (
                  <form
                    key={member.id}
                    action={upsertTeamMember}
                    className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5"
                  >
                    <input type="hidden" name="id" value={member.id} />
                    <div className="grid gap-4">
                      <Field label="Name" name="name" defaultValue={member.name} disabled={!actionsEnabled} />
                      <Field label="Role" name="role" defaultValue={member.role} disabled={!actionsEnabled} />
                      <TextareaField label="Bio" name="bio" defaultValue={member.bio} rows={4} disabled={!actionsEnabled} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={member.sortOrder} disabled={!actionsEnabled} />
                      <MediaFields
                        currentUrl={member.imageUrl}
                        urlName="imageUrl"
                        currentUrlName="currentImageUrl"
                        fileName="imageFile"
                        removeName="removeMedia"
                        label="Current team image"
                        disabled={!actionsEnabled}
                      />
                      <Toggle label="Visible on site" name="isActive" defaultChecked={member.isActive} disabled={!actionsEnabled} />
                      <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                          Save team member
                        </button>
                        <button type="submit" formAction={deleteTeamMember} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                          Delete
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
                <form action={upsertTeamMember} className="rounded-[1.8rem] border border-dashed border-[var(--color-line)] bg-white p-5">
                  <h3 className="text-xl font-extrabold">Add team member</h3>
                  <div className="mt-4 grid gap-4">
                    <Field label="Name" name="name" disabled={!actionsEnabled} />
                    <Field label="Role" name="role" disabled={!actionsEnabled} />
                    <TextareaField label="Bio" name="bio" rows={4} disabled={!actionsEnabled} />
                    <Field label="Sort order" name="sortOrder" type="number" defaultValue={dashboard.teamMembers.length + 1} disabled={!actionsEnabled} />
                    <MediaFields
                      currentUrl={null}
                      urlName="imageUrl"
                      currentUrlName="currentImageUrl"
                      fileName="imageFile"
                      removeName="removeMedia"
                      label="Team image"
                      disabled={!actionsEnabled}
                    />
                    <Toggle label="Visible on site" name="isActive" defaultChecked disabled={!actionsEnabled} />
                    <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      Add team member
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section
              id="clients"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Clients"
                title="Client logos and references"
                body="Use this when you want the client-trust section to be visible on the site."
              />
              <div className="grid gap-5 xl:grid-cols-2">
                {dashboard.clients.map((client) => (
                  <form
                    key={client.id}
                    action={upsertClient}
                    className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5"
                  >
                    <input type="hidden" name="id" value={client.id} />
                    <div className="grid gap-4">
                      <Field label="Name" name="name" defaultValue={client.name} disabled={!actionsEnabled} />
                      <Field label="Website URL" name="websiteUrl" defaultValue={client.websiteUrl} disabled={!actionsEnabled} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={client.sortOrder} disabled={!actionsEnabled} />
                      <MediaFields
                        currentUrl={client.logoUrl}
                        urlName="logoUrl"
                        currentUrlName="currentLogoUrl"
                        fileName="logoFile"
                        removeName="removeLogo"
                        label="Current client logo"
                        disabled={!actionsEnabled}
                      />
                      <Toggle label="Visible on site" name="isActive" defaultChecked={client.isActive} disabled={!actionsEnabled} />
                      <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                          Save client
                        </button>
                        <button type="submit" formAction={deleteClient} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                          Delete
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
                <form action={upsertClient} className="rounded-[1.8rem] border border-dashed border-[var(--color-line)] bg-white p-5">
                  <h3 className="text-xl font-extrabold">Add client</h3>
                  <div className="mt-4 grid gap-4">
                    <Field label="Name" name="name" disabled={!actionsEnabled} />
                    <Field label="Website URL" name="websiteUrl" disabled={!actionsEnabled} />
                    <Field label="Sort order" name="sortOrder" type="number" defaultValue={dashboard.clients.length + 1} disabled={!actionsEnabled} />
                    <MediaFields
                      currentUrl={null}
                      urlName="logoUrl"
                      currentUrlName="currentLogoUrl"
                      fileName="logoFile"
                      removeName="removeLogo"
                      label="Client logo"
                      disabled={!actionsEnabled}
                    />
                    <Toggle label="Visible on site" name="isActive" defaultChecked disabled={!actionsEnabled} />
                    <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      Add client
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section
              id="gallery"
              className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6"
            >
              <PanelHeading
                eyebrow="Gallery"
                title="Gallery media"
                body="Upload gallery images or videos so the gallery section can be managed without opening the database."
              />
              <div className="grid gap-5 xl:grid-cols-2">
                {dashboard.galleryItems.map((item) => (
                  <GalleryCard key={item.id} item={item} actionsEnabled={actionsEnabled} />
                ))}
                <GalleryCard actionsEnabled={actionsEnabled} />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
