/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Check, MapPin, MoveRight, Phone } from "lucide-react";
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
            inverse ? "text-white/68" : "text-[var(--color-secondary)]"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2
          className={`max-w-3xl text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl ${
            inverse ? "text-white" : "text-[var(--color-ink)]"
          }`}
        >
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p
          className={`max-w-3xl text-base leading-8 sm:text-lg ${
            inverse ? "text-white/76" : "text-[var(--color-muted)]"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {body ? (
        <p
          className={`max-w-3xl text-sm leading-7 ${
            inverse ? "text-white/64" : "text-[var(--color-muted)]"
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
      <div className={`overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 ${className}`}>
        <video src={mediaUrl} controls playsInline className="h-full w-full object-cover" />
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div className={`overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 ${className}`}>
        <img src={mediaUrl} alt={alt || label} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/40 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_92%,white_8%),color-mix(in_srgb,var(--color-secondary)_34%,white_66%))] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.36))]" />
      <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/24 bg-white/10 px-4 py-4 text-white backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/74">{label}</p>
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

  const heroStats = [
    { label: "Live products", value: String(featuredProducts.length).padStart(2, "0") },
    { label: "Delivery states", value: String(deliveryStates.length).padStart(2, "0") },
    { label: "Support units", value: String(services.length).padStart(2, "0") },
  ];

  return (
    <div id="top" className="min-h-screen">
      <SiteHeader />

      <main className="pb-10">
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/50 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_97%,black_3%),color-mix(in_srgb,var(--color-primary)_84%,black_16%))] px-6 py-8 text-white shadow-[0_34px_80px_-40px_rgba(15,23,42,0.85)] sm:px-8 sm:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.24),transparent_28%)]" />
              <div className="relative space-y-8">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    {hero?.eyebrow || "Blind systems and interior finishing"}
                  </span>
                  {contact?.phone1 ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold text-white/80">
                      <Phone size={14} />
                      {contact.phone1}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl text-5xl font-extrabold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                    {hero?.title || "Custom blinds with a cleaner modern storefront"}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
                    {hero?.subtitle || settings?.tagline}
                  </p>
                  {hero?.body ? (
                    <p className="max-w-2xl text-sm leading-7 text-white/64">{hero.body}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={hero?.primaryCtaLink || "/products"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    {hero?.primaryCtaLabel || "Browse products"}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href={hero?.secondaryCtaLink || "/account"}
                    className="rounded-full border border-white/18 px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    {hero?.secondaryCtaLabel || "Track orders"}
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {heroStats.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[1.5rem] border border-white/12 bg-white/8 px-4 py-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
                        {item.label}
                      </p>
                      <p className="mt-2 text-3xl font-extrabold tracking-[-0.05em]">
                        {item.value}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <MediaFrame
                label={hero?.title || settings?.brandName || "Sunpilot"}
                mediaUrl={hero?.mediaUrl}
                mediaKind={hero?.mediaKind}
                alt={hero?.mediaAlt}
                className="min-h-[22rem] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)]"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.35)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                    Payment flow
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Transfer confirmation with receipt upload and manual review.
                  </p>
                </article>
                <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.35)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                    Delivery
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Clear status updates from order review through delivery coordination.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Measurement-first ordering for homes, offices, and projects.",
              "A cleaner catalog with stronger product discovery and modern cards.",
              "Account-based tracking once the transfer receipt has been reviewed.",
            ].map((item) => (
              <article
                key={item}
                className="rounded-[1.9rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] p-5 text-sm leading-7 text-[var(--color-muted)] shadow-[0_20px_45px_-34px_rgba(15,23,42,0.28)]"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <SectionLead
              eyebrow={productsSection?.eyebrow || "Featured selection"}
              title={productsSection?.title || "Start with the products customers open first"}
              subtitle={
                productsSection?.subtitle ||
                "A tighter visual system, clearer pricing, and faster movement into checkout."
              }
              body={productsSection?.body}
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
            >
              View all products
              <MoveRight size={16} />
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

        <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] sm:p-8">
              <SectionLead
                eyebrow={about?.eyebrow}
                title={about?.title}
                subtitle={about?.subtitle}
                body={about?.body}
              />
            </div>

            <div className="grid gap-4">
              <MediaFrame
                label={about?.title || settings?.brandName || "About"}
                mediaUrl={about?.mediaUrl}
                mediaKind={about?.mediaKind}
                alt={about?.mediaAlt}
                className="min-h-[18rem] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)]"
              />
              {highlights.length ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.7rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5"
                    >
                      <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
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
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8">
            <SectionLead
              eyebrow={servicesSection?.eyebrow}
              title={servicesSection?.title}
              subtitle={servicesSection?.subtitle}
              body={servicesSection?.body}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]"
              >
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="h-56"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 90%, white 10%), color-mix(in srgb, var(--color-secondary) 35%, white 65%))"
                          : "linear-gradient(145deg, color-mix(in srgb, var(--color-secondary) 25%, white 75%), color-mix(in srgb, var(--color-primary) 72%, white 28%))",
                    }}
                  />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                    Service
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
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

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-6 rounded-[2.4rem] border border-white/10 bg-[linear-gradient(140deg,color-mix(in_srgb,var(--color-primary)_97%,black_3%),color-mix(in_srgb,var(--color-primary)_78%,black_22%))] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1fr_0.95fr]">
            <SectionLead
              eyebrow={reliability?.eyebrow}
              title={reliability?.title || "Order confidence"}
              subtitle={reliability?.subtitle}
              body={reliability?.body}
              inverse
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Open a product, place the order, complete the transfer, attach the receipt, and track progress later.",
                "The team reviews each receipt manually, so customers always know there is a human confirmation step.",
                "Orders stay visible from the account area instead of disappearing after checkout.",
                "Delivery coordination can be updated by state as orders move forward.",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-[1.7rem] border border-white/12 bg-white/8 p-5 text-sm leading-7 text-white/76"
                >
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <Check size={16} />
                  </span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {galleryItems.length ? (
          <section id="gallery" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
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
                  className="overflow-hidden rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] shadow-[0_20px_50px_-36px_rgba(15,23,42,0.3)]"
                >
                  <MediaFrame
                    label={item.title}
                    mediaUrl={item.mediaUrl}
                    mediaKind={item.mediaKind}
                    alt={item.title}
                    className="h-72 rounded-none border-0"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{item.title}</h3>
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

        <section id="team" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8">
            <SectionLead
              eyebrow={team?.eyebrow || "Team"}
              title={team?.title || "The people behind the customer experience"}
              subtitle={team?.subtitle}
              body={team?.body}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member, index) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] shadow-[0_20px_50px_-36px_rgba(15,23,42,0.28)]"
              >
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="h-72"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(145deg, var(--color-primary), color-mix(in srgb, var(--color-secondary) 38%, var(--color-primary) 62%))"
                          : "linear-gradient(145deg, color-mix(in srgb, var(--color-secondary) 35%, white 65%), var(--color-primary))",
                    }}
                  />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                    {member.role}
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">{member.name}</h3>
                  {member.bio ? (
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{member.bio}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {clients.length ? (
          <section id="clients" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
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
                  className="rounded-[1.8rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6 text-center shadow-[0_18px_45px_-34px_rgba(15,23,42,0.25)]"
                >
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="mx-auto h-16 w-auto max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : null}
                  <p className="mt-4 text-lg font-extrabold tracking-[-0.03em]">{client.name}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section id="contact" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.24)] sm:p-8">
              <SectionLead
                eyebrow={contactSection?.eyebrow}
                title={contactSection?.title}
                subtitle={contactSection?.subtitle}
                body={contactSection?.body}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contact?.phone1 ? (
                <article className="rounded-[1.8rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                    Phone
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--color-ink)]">{contact.phone1}</p>
                </article>
              ) : null}
              {contact?.phone2 ? (
                <article className="rounded-[1.8rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                    Alternate
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--color-ink)]">{contact.phone2}</p>
                </article>
              ) : null}
              {contact?.email ? (
                <article className="rounded-[1.8rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                    Email
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--color-ink)]">{contact.email}</p>
                </article>
              ) : null}
              {contact?.address ? (
                <article className="rounded-[1.8rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                    <MapPin size={14} />
                    Address
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--color-ink)]">{contact.address}</p>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
