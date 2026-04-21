import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getLandingPageData } from "@/lib/data";

function SectionLead({
  eyebrow,
  title,
  subtitle,
  body,
  inverse = false,
}: {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  inverse?: boolean;
}) {
  if (!title && !subtitle && !body) {
    return null;
  }

  return (
    <div className="space-y-4">
      {eyebrow ? (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.28em] ${
            inverse ? "text-white/70" : "text-[var(--color-secondary)]"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? <h2 className="font-display text-5xl leading-none">{title}</h2> : null}
      {subtitle ? (
        <p
          className={`max-w-3xl text-lg leading-8 ${
            inverse ? "text-white/80" : "text-[var(--color-muted)]"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {body ? (
        <p
          className={`max-w-3xl text-sm leading-7 ${
            inverse ? "text-white/70" : "text-[var(--color-muted)]"
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function MediaFrame({
  label,
  mediaUrl,
  mediaKind,
  alt,
  className = "",
}: {
  label: string;
  mediaUrl?: string | null;
  mediaKind?: "image" | "video";
  alt?: string | null;
  className?: string;
}) {
  if (mediaUrl && mediaKind === "video") {
    return (
      <div className={`overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}>
        <video
          src={mediaUrl}
          controls
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div className={`overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}>
        <img
          src={mediaUrl}
          alt={alt || label}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_92%,white_8%),color-mix(in_srgb,var(--color-secondary)_42%,white_58%))] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%)]" />
      <div className="absolute inset-y-0 left-[18%] w-px bg-white/30" />
      <div className="absolute inset-y-0 left-[54%] w-px bg-white/20" />
      <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/25 bg-black/10 px-4 py-4 text-white backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-[0.26em] text-white/75">{label}</p>
      </div>
    </div>
  );
}

export default async function Home() {
  const {
    settings,
    contact,
    sections,
    highlights,
    featuredProducts,
    services,
    teamMembers,
    clients,
    galleryItems,
    paymentAccount,
    socialLinks,
  } = await getLandingPageData();

  const hero = sections.hero;
  const about = sections.about;
  const servicesSection = sections.services;
  const reliability = sections.reliability;
  const gallery = sections.gallery;
  const team = sections.team;
  const clientsSection = sections.clients;
  const booking = sections.booking;
  const contactSection = sections.contact;

  const heroMetrics = [
    {
      label: servicesSection?.title || "Services",
      value: services.length.toString().padStart(2, "0"),
    },
    {
      label: team?.title || "Team",
      value: teamMembers.length.toString().padStart(2, "0"),
    },
    {
      label: clientsSection?.title || "Clients",
      value: clients.length.toString().padStart(2, "0"),
    },
  ];

  return (
    <div id="top" className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-secondary)_22%,transparent),transparent_36%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
            <div className="space-y-8">
              <SectionLead
                eyebrow={hero?.eyebrow}
                title={hero?.title}
                subtitle={hero?.subtitle}
                body={hero?.body || settings?.tagline}
              />

              <div className="flex flex-wrap gap-4">
                {hero?.primaryCtaLabel && hero.primaryCtaLink ? (
                  <Link
                    href={hero.primaryCtaLink}
                    className="rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    {hero.primaryCtaLabel}
                  </Link>
                ) : null}
                {hero?.secondaryCtaLabel && hero.secondaryCtaLink ? (
                  <Link
                    href={hero.secondaryCtaLink}
                    className="rounded-full border border-[var(--color-line)] bg-white px-6 py-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
                  >
                    {hero.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {metric.label}
                    </p>
                    <p className="mt-3 font-display text-4xl text-[var(--color-ink)]">
                      {metric.value}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <MediaFrame
                label={hero?.title || settings?.brandName || "Sunpilot"}
                mediaUrl={hero?.mediaUrl}
                mediaKind={hero?.mediaKind}
                alt={hero?.mediaAlt}
                className="min-h-[28rem]"
              />

              {settings?.tagline ? (
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
                  <p className="text-sm leading-8 text-[var(--color-muted)]">
                    {settings.tagline}
                  </p>
                </article>
              ) : null}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <MediaFrame
            label={about?.title || "About"}
            mediaUrl={about?.mediaUrl}
            mediaKind={about?.mediaKind}
            alt={about?.mediaAlt}
            className="min-h-[24rem]"
          />
          <SectionLead
            eyebrow={about?.eyebrow}
            title={about?.title}
            subtitle={about?.subtitle}
            body={about?.body}
          />
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <SectionLead
            eyebrow={servicesSection?.eyebrow}
            title={servicesSection?.title}
            subtitle={servicesSection?.subtitle}
            body={servicesSection?.body}
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/90"
              >
                <MediaFrame
                  label={service.title}
                  mediaUrl={service.imageUrl}
                  mediaKind="image"
                  alt={service.title}
                  className="h-64 rounded-none border-0"
                />
                <div className="space-y-3 p-6">
                  <h3 className="font-display text-3xl leading-none">{service.title}</h3>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Featured Catalog
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none">
                Live product listings from Supabase
              </h2>
            </div>
            <Link
              href="/catalog"
              className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
            >
              Browse full catalog
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="why-us" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <SectionLead
            eyebrow={reliability?.eyebrow}
            title={reliability?.title}
            subtitle={reliability?.subtitle}
            body={reliability?.body}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-6"
              >
                <h3 className="text-lg font-extrabold text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <SectionLead
            eyebrow={gallery?.eyebrow}
            title={gallery?.title}
            subtitle={gallery?.subtitle}
            body={gallery?.body}
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {galleryItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/90"
              >
                <MediaFrame
                  label={item.title}
                  mediaUrl={item.mediaUrl}
                  mediaKind={item.mediaKind}
                  alt={item.title}
                  className="h-72 rounded-none border-0"
                />
                <div className="space-y-3 p-6">
                  <h3 className="font-display text-3xl leading-none">{item.title}</h3>
                  {item.description ? (
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="team" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <SectionLead
            eyebrow={team?.eyebrow}
            title={team?.title}
            subtitle={team?.subtitle}
            body={team?.body}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/90"
              >
                <MediaFrame
                  label={member.name}
                  mediaUrl={member.imageUrl}
                  mediaKind="image"
                  alt={member.name}
                  className="h-80 rounded-none border-0"
                />
                <div className="space-y-3 p-6">
                  <div>
                    <h3 className="font-display text-3xl leading-none">{member.name}</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-secondary)]">
                      {member.role}
                    </p>
                  </div>
                  {member.bio ? (
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      {member.bio}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="clients" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <SectionLead
            eyebrow={clientsSection?.eyebrow}
            title={clientsSection?.title}
            subtitle={clientsSection?.subtitle}
            body={clientsSection?.body}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {clients.map((client) => {
              const content = (
                <article className="flex min-h-44 items-center justify-center rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-20 max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
                      {client.name}
                    </p>
                  )}
                </article>
              );

              return client.websiteUrl ? (
                <Link key={client.id} href={client.websiteUrl}>
                  {content}
                </Link>
              ) : (
                <div key={client.id}>{content}</div>
              );
            })}
          </div>
        </section>

        <section
          id="booking"
          className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-10"
        >
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6 lg:p-8">
            <SectionLead
              eyebrow={booking?.eyebrow}
              title={booking?.title}
              subtitle={booking?.subtitle}
              body={booking?.body}
            />

            <div className="mt-8 grid gap-4">
              <Link
                href="/catalog"
                className="rounded-[1.6rem] border border-[var(--color-line)] bg-[var(--color-accent)] px-5 py-4 text-sm font-semibold text-[var(--color-ink)]"
              >
                Browse products
              </Link>
              <Link
                href="/checkout/offline"
                className="rounded-[1.6rem] bg-[var(--color-primary)] px-5 py-4 text-sm font-semibold text-white"
              >
                Start checkout
              </Link>
              {paymentAccount ? (
                <div className="rounded-[1.6rem] border border-[var(--color-line)] bg-white px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                    Payment Account
                  </p>
                  <p className="mt-3 text-lg font-bold text-[var(--color-ink)]">
                    {paymentAccount.bankName}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {paymentAccount.accountName}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-[var(--color-ink)]">
                    {paymentAccount.accountNumber}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {paymentAccount.note}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div id="contact" className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-primary)] p-6 text-white lg:p-8">
              <SectionLead
                eyebrow={contactSection?.eyebrow}
                title={contactSection?.title}
                subtitle={contactSection?.subtitle}
                body={contactSection?.body}
                inverse
              />
            </div>

            <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6 lg:p-8">
              <div className="space-y-4 text-sm leading-7 text-[var(--color-muted)]">
                {contact?.phone1 ? <p>{contact.phone1}</p> : null}
                {contact?.phone2 ? <p>{contact.phone2}</p> : null}
                {contact?.email ? <p>{contact.email}</p> : null}
                {contact?.address ? <p>{contact.address}</p> : null}
              </div>

              {socialLinks.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                    >
                      {link.displayName}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
