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
            inverse ? "text-white/82" : "text-[var(--color-muted)]"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {body ? (
        <p
          className={`max-w-3xl text-sm leading-7 ${
            inverse ? "text-white/76" : "text-[var(--color-muted)]"
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
      <div className={`overflow-hidden rounded-[2.2rem] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}>
        <video src={mediaUrl} controls playsInline className="h-full w-full object-cover" />
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div className={`overflow-hidden rounded-[2.2rem] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}>
        <img src={mediaUrl} alt={alt || label} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2.2rem] border border-[var(--color-line)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_92%,white_8%),color-mix(in_srgb,var(--color-secondary)_35%,white_65%))] ${className}`}
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
    deliveryStates,
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

  const collections = Array.from(new Set(featuredProducts.map((product) => product.collection)));
  const heroStats = [
    { label: "Live products", value: featuredProducts.length.toString().padStart(2, "0") },
    { label: "Delivery states", value: deliveryStates.length.toString().padStart(2, "0") },
    { label: "Support units", value: services.length.toString().padStart(2, "0") },
  ];

  return (
    <div id="top" className="min-h-screen">
      <SiteHeader />

      <main className="pb-10">
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="space-y-4 rounded-[2.4rem] border border-[var(--color-line)] bg-white/92 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Shop by category
              </p>
              <div className="space-y-2">
                {collections.map((collection) => (
                  <Link
                    key={collection}
                    href={`/products?collection=${encodeURIComponent(collection)}`}
                    className="block rounded-2xl border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    {collection}
                  </Link>
                ))}
              </div>
              <div className="rounded-[1.8rem] bg-[color-mix(in_srgb,var(--color-secondary)_12%,white_88%)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Marketplace note
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Browse by category, open a product, then continue to guided checkout.
                </p>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="overflow-hidden rounded-[2.8rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_78%,black_22%))] text-white">
                <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
                  <div className="space-y-8">
                    <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/84">
                      <span>Marketplace storefront</span>
                      <span className="h-1 w-1 rounded-full bg-white/70" />
                      <span>Admin listed only</span>
                    </div>

                    <SectionLead
                      eyebrow={hero?.eyebrow || "Blinds and interior finishing"}
                      title={hero?.title || "Shop window blinds with a stronger marketplace experience"}
                      subtitle={hero?.subtitle || settings?.tagline}
                      body={hero?.body}
                      inverse
                    />

                    <form action="/products" className="flex flex-wrap gap-3">
                      <input
                        type="search"
                        name="q"
                        placeholder="Search roller, zebra, roman, office blinds..."
                        className="min-w-[18rem] flex-1 rounded-2xl border border-white/12 bg-white px-5 py-4 text-[var(--color-ink)] outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-2xl bg-[var(--color-secondary)] px-6 py-4 text-sm font-semibold text-[var(--color-ink)]"
                      >
                        Search products
                      </button>
                    </form>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={hero?.primaryCtaLink || "/products"}
                        className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-[var(--color-ink)]"
                      >
                        {hero?.primaryCtaLabel || "Browse catalog"}
                      </Link>
                      <Link
                        href="/checkout/offline"
                        className="rounded-2xl border border-white/18 px-6 py-4 text-sm font-semibold text-white"
                      >
                        Start checkout
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <MediaFrame
                      label={hero?.title || settings?.brandName || "Sunpilot"}
                      mediaUrl={hero?.mediaUrl}
                      mediaKind={hero?.mediaKind}
                      alt={hero?.mediaAlt}
                      className="min-h-[24rem] border-white/12"
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      {heroStats.map((item) => (
                        <article
                          key={item.label}
                          className="rounded-[1.6rem] border border-white/12 bg-white/8 p-4"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/68">
                            {item.label}
                          </p>
                          <p className="mt-2 font-display text-3xl">{item.value}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                {[
                  "Category-led browsing",
                  "Admin-controlled listings",
                  "Offline checkout with tracking",
                ].map((item) => (
                  <article
                    key={item}
                    className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    {item}
                  </article>
                ))}
              </section>
            </div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <SectionLead
              eyebrow={productsSection?.eyebrow || "Featured listings"}
              title={productsSection?.title || "Popular marketplace picks"}
              subtitle={
                productsSection?.subtitle ||
                "Start with the products customers are most likely to open first."
              }
              body={productsSection?.body}
            />
            <Link
              href="/products"
              className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              View all products
            </Link>
          </div>

          {featuredProducts.length ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
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
              className="min-h-[25rem]"
            />
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="mb-8">
            <SectionLead
              eyebrow={servicesSection?.eyebrow}
              title={servicesSection?.title}
              subtitle={servicesSection?.subtitle}
              body={servicesSection?.body}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                ) : (
                  <div className="h-56 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_92%,white_8%),color-mix(in_srgb,var(--color-secondary)_34%,white_66%))]" />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-[var(--color-ink)]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="grid gap-6 rounded-[2.5rem] bg-[linear-gradient(150deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_72%,black_28%))] px-8 py-10 text-white lg:grid-cols-[1fr_0.95fr]">
            <SectionLead
              eyebrow={reliability?.eyebrow}
              title={reliability?.title || "Order confidence"}
              subtitle={reliability?.subtitle}
              body={reliability?.body}
              inverse
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.8rem] border border-white/15 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                  Checkout path
                </p>
                <p className="mt-3 text-sm leading-7 text-white/82">
                  Open product, continue to checkout, transfer, upload proof, and track from account.
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-white/15 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                  Admin listing control
                </p>
                <p className="mt-3 text-sm leading-7 text-white/82">
                  Customers can browse and order, but only admins publish live listings.
                </p>
              </article>
            </div>
          </div>
        </section>

        {galleryItems.length ? (
          <section id="gallery" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
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

        <section id="team" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="mb-8">
            <SectionLead
              eyebrow={team?.eyebrow || "Team"}
              title={team?.title || "The people behind the marketplace"}
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
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{member.bio}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {clients.length ? (
          <section id="clients" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
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

        <section id="contact" className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
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
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">{contact.phone1}</p>
                  </article>
                ) : null}
                {contact?.phone2 ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Alternate
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">{contact.phone2}</p>
                  </article>
                ) : null}
                {contact?.email ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Email
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">{contact.email}</p>
                  </article>
                ) : null}
                {contact?.address ? (
                  <article className="rounded-[1.6rem] bg-[rgba(245,249,255,0.9)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Address
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink)]">{contact.address}</p>
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
