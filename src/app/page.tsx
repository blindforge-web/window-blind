/* eslint-disable @next/next/no-img-element */
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
            inverse ? "text-white/72" : "text-[var(--color-muted)]"
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
      <div
        className={`overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}
      >
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
      <div
        className={`overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}
      >
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
      className={`relative overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_92%,white_8%),color-mix(in_srgb,var(--color-secondary)_38%,white_62%))] ${className}`}
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
  } = await getLandingPageData();

  const hero = sections.hero;
  const about = sections.about;
  const productsSection = sections.products ?? sections.booking;
  const servicesSection = sections.services;
  const reliability = sections.reliability;
  const gallery = sections.gallery;
  const team = sections.team;
  const clientsSection = sections.clients;
  const contactSection = sections.contact;

  const heroMetrics = [
    {
      label: "Products",
      value: featuredProducts.length.toString().padStart(2, "0"),
    },
    {
      label: servicesSection?.title || "Services",
      value: services.length.toString().padStart(2, "0"),
    },
    {
      label: team?.title || "Team",
      value: teamMembers.length.toString().padStart(2, "0"),
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
                <Link
                  href={hero?.primaryCtaLink || "/products"}
                  className="rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  {hero?.primaryCtaLabel || "Browse products"}
                </Link>
                <Link
                  href={hero?.secondaryCtaLink || "/account"}
                  className="rounded-full border border-[var(--color-line)] bg-white px-6 py-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
                >
                  {hero?.secondaryCtaLabel || "Track my orders"}
                </Link>
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

        <section id="about" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-6">
              <SectionLead
                eyebrow={about?.eyebrow}
                title={about?.title}
                subtitle={about?.subtitle}
                body={about?.body}
              />

              {highlights.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/88 p-5"
                    >
                      <h3 className="text-xl font-extrabold text-[var(--color-ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>

            <MediaFrame
              label={about?.title || settings?.brandName || "About"}
              mediaUrl={about?.mediaUrl}
              mediaKind={about?.mediaKind}
              alt={about?.mediaAlt}
              className="min-h-[24rem]"
            />
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <SectionLead
              eyebrow={productsSection?.eyebrow || "Products"}
              title={productsSection?.title || "Featured products"}
              subtitle={
                productsSection?.subtitle ||
                "See a few current listings, then move into the full browse view."
              }
              body={productsSection?.body}
            />
            <Link
              href="/products"
              className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
            >
              Browse more
            </Link>
          </div>

          {featuredProducts.length ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,249,241,0.74)] p-10">
              <h2 className="font-display text-4xl">Products will appear here soon</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Once live products are listed in Supabase, the home page will show
                the latest three here.
              </p>
            </div>
          )}
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <SectionLead
            eyebrow={servicesSection?.eyebrow}
            title={servicesSection?.title}
            subtitle={servicesSection?.subtitle}
            body={servicesSection?.body}
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/88"
              >
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-[var(--color-ink)]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="grid gap-6 rounded-[2.4rem] bg-[linear-gradient(150deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_70%,black_30%))] px-8 py-10 text-white lg:grid-cols-[1fr_0.9fr]">
            <SectionLead
              eyebrow={reliability?.eyebrow}
              title={reliability?.title}
              subtitle={reliability?.subtitle}
              body={reliability?.body}
              inverse
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.8rem] border border-white/15 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                  Order path
                </p>
                <p className="mt-3 text-sm leading-7 text-white/82">
                  Browse products, move into offline checkout, upload proof of
                  payment, and wait for admin confirmation.
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-white/15 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                  Customer access
                </p>
                <p className="mt-3 text-sm leading-7 text-white/82">
                  Account login is optional, but signed-in customers can track
                  status and open receipts later.
                </p>
              </article>
            </div>
          </div>
        </section>

        {galleryItems.length ? (
          <section id="gallery" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <div className="mb-8">
              <SectionLead
                eyebrow={gallery?.eyebrow}
                title={gallery?.title}
                subtitle={gallery?.subtitle}
                body={gallery?.body}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {galleryItems.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/88"
                >
                  <MediaFrame
                    label={item.title}
                    mediaUrl={item.mediaUrl}
                    mediaKind={item.mediaKind}
                    alt={item.title}
                    className="h-72 rounded-none border-0"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-extrabold">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section id="team" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="mb-8">
            <SectionLead
              eyebrow={team?.eyebrow}
              title={team?.title}
              subtitle={team?.subtitle}
              body={team?.body}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white/88"
              >
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-72 bg-[linear-gradient(145deg,var(--color-primary),var(--color-secondary))]" />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                    {member.role}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold">{member.name}</h3>
                  {member.bio ? (
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {member.bio}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {clients.length ? (
          <section id="clients" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <div className="mb-8">
              <SectionLead
                eyebrow={clientsSection?.eyebrow}
                title={clientsSection?.title}
                subtitle={clientsSection?.subtitle}
                body={clientsSection?.body}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {clients.map((client) => (
                <article
                  key={client.id}
                  className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-6"
                >
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="h-16 w-auto max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : null}
                  <p className="mt-4 text-lg font-extrabold">{client.name}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="rounded-[2.4rem] border border-[var(--color-line)] bg-white/92 px-8 py-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                  Next step
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none">
                  Ready to place an order?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  Move into the product browse area to choose a listing, then open
                  the offline checkout page when you are ready to pay and upload
                  your proof.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white"
                >
                  Browse products
                </Link>
                <Link
                  href="/account"
                  className="rounded-full border border-[var(--color-line)] px-6 py-4 text-sm font-semibold"
                >
                  Open account
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionLead
              eyebrow={contactSection?.eyebrow}
              title={contactSection?.title}
              subtitle={contactSection?.subtitle}
              body={contactSection?.body}
            />

            <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {contact?.phone1 ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Phone
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">
                      {contact.phone1}
                    </p>
                  </article>
                ) : null}
                {contact?.phone2 ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Alternate
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">
                      {contact.phone2}
                    </p>
                  </article>
                ) : null}
                {contact?.email ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Email
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">
                      {contact.email}
                    </p>
                  </article>
                ) : null}
                {contact?.address ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Address
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">
                      {contact.address}
                    </p>
                  </article>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

