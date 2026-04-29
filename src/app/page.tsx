import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, PhoneCall, Sparkles, Users } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { TeamCarousel } from "@/components/team/team-carousel";
import { ProductCard } from "@/components/store/product-card";
import { ProductVisual } from "@/components/store/product-visual";
import { getLandingPageData } from "@/lib/data";

function SectionTitle({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-3">
      <p className="ui-section-label">{label}</p>
      <h2 className="max-w-3xl text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">{body}</p>
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
    deliveryStates,
  } = await getLandingPageData();

  const hero = sections.hero;
  const about = sections.about;
  const contactSection = sections.contact;
  const teamSection = sections.team;
  const heroProduct = featuredProducts[0];
  const trustCards = [
    {
      icon: Sparkles,
      title: "Made-to-measure expertise",
      body: "Every blind is prepared around the size, finish, and control option that suits the space.",
    },
    {
      icon: PackageCheck,
      title: "Dependable order follow-up",
      body: "From confirmation to delivery planning, the Sunpilot team stays available with practical support.",
    },
  ];
  const companyHighlights = highlights.length
    ? highlights.slice(0, 3)
    : [
        {
          id: "highlight-made-to-measure",
          title: "Made to measure",
          description:
            "Every order is prepared around the exact size, finish, and light control your space requires.",
          sortOrder: 1,
          isActive: true,
        },
        {
          id: "highlight-guidance",
          title: "Practical guidance",
          description:
            "Customers get clear help with style selection, measurements, and order planning before production begins.",
          sortOrder: 2,
          isActive: true,
        },
        {
          id: "highlight-fulfilment",
          title: "Reliable fulfilment",
          description:
            "Sunpilot keeps each order moving with coordinated follow-up from confirmation to delivery.",
          sortOrder: 3,
          isActive: true,
        },
      ];
  const serviceCards = services.length
    ? services.slice(0, 3)
    : [
        {
          id: "service-guidance",
          title: "Measurement guidance",
          description:
            "Support with sizing, blind selection, and order preparation for a better fit in the final space.",
          imageUrl: null,
          sortOrder: 1,
          isActive: true,
        },
        {
          id: "service-supply",
          title: "Residential and project supply",
          description:
            "Blind solutions for homes, offices, hospitality spaces, and interior projects that need dependable coordination.",
          imageUrl: null,
          sortOrder: 2,
          isActive: true,
        },
        {
          id: "service-delivery",
          title: "Delivery follow-up",
          description:
            "Clear updates from confirmation to dispatch so customers know what to expect as the order moves forward.",
          imageUrl: null,
          sortOrder: 3,
          isActive: true,
        },
      ];
  const highlightIcons = [Sparkles, Users, MapPin];

  return (
    <div id="top" className="min-h-screen">
      <SiteHeader />

      <main className="px-4 pt-6 sm:px-6 lg:px-10">
        <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="ui-panel-soft p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-3">
              <span className="ui-pill ui-pill-solid">{hero?.eyebrow || "Made-to-measure blinds"}</span>
              {contact?.phone1 ? (
                <span className="ui-pill">
                  <PhoneCall size={14} />
                  {contact.phone1}
                </span>
              ) : null}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-[-0.07em] text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
              {hero?.title || "Custom blinds for homes, offices, and project spaces"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              {hero?.subtitle ||
                settings?.tagline ||
                "Made-to-measure blinds with dependable support from selection to delivery."}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {hero?.body ||
                "Sunpilot supports private homes, offices, hospitality spaces, and project interiors with practical product guidance, accurate preparation, and coordinated delivery follow-up."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="ui-button ui-button-primary">
                Browse Products
                <ArrowRight size={16} />
              </Link>
              <Link href="/checkout/order" className="ui-button ui-button-secondary">
                Start Order
              </Link>
              <Link href="/orders" className="ui-button ui-button-outline">
                Track Orders
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="ui-panel p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Products
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{featuredProducts.length}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Blind styles selected for residential and commercial spaces.
                </p>
              </article>
              <article className="ui-panel p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Delivery states
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{deliveryStates.length}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Active delivery coverage across key locations in Nigeria.
                </p>
              </article>
              <article className="ui-panel p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Support
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">
                  {contact?.phone1 ? "Available" : "Ready"}
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Guidance on measurements, finishes, and order planning.
                </p>
              </article>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="ui-panel p-4">
              {heroProduct ? (
                <ProductVisual
                  product={heroProduct}
                  className="min-h-[28rem] bg-[linear-gradient(160deg,#f4f8ff,#d7e6ff)]"
                  mediaClassName="h-full w-full object-contain p-8"
                />
              ) : (
                <div className="flex min-h-[28rem] items-end rounded-[1.7rem] bg-[linear-gradient(155deg,#dbe8ff,#0f4c97)] p-6 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                      Sunpilot
                    </p>
                    <p className="mt-3 max-w-sm text-3xl font-extrabold tracking-[-0.05em]">
                      Made-to-measure blind solutions for homes, offices, and project interiors.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trustCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="ui-panel p-5">
                    <Icon size={18} className="text-[var(--color-primary)]" />
                    <p className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {item.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl">
          <SectionTitle
            label="Why Sunpilot"
            title="What makes Sunpilot different"
            body="Customers choose Sunpilot for practical guidance, dependable preparation, and a finish that suits real spaces."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {companyHighlights.map((item, index) => {
              const Icon = highlightIcons[index % highlightIcons.length];
              return (
                <article key={item.id} className="ui-panel p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="ui-section-label">{String(index + 1).padStart(2, "0")}</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                      <Icon size={18} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="products" className="mx-auto mt-14 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              label="Products"
              title={sections.products?.title || "Blind styles for homes, offices, and project spaces"}
              body={
                sections.products?.subtitle ||
                sections.products?.body ||
                "Explore collections designed for privacy, light control, and a cleaner finish across residential and commercial interiors."
              }
            />
            <Link href="/products" className="ui-button ui-button-primary">
              View All Products
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="team" className="mx-auto mt-14 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              label={teamSection?.eyebrow || "Team"}
              title={teamSection?.title || "Meet the people behind every Sunpilot order"}
              body={
                teamSection?.subtitle ||
                teamSection?.body ||
                "Meet the people who support product guidance, fabrication, delivery coordination, and installation readiness."
              }
            />
            <Link href="/team" className="ui-button ui-button-secondary">
              View All Team
              <Users size={16} />
            </Link>
          </div>
          <div className="mt-8">
            <TeamCarousel members={teamMembers} />
          </div>
        </section>

        <section id="about" className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="ui-panel p-7 sm:p-8">
            <SectionTitle
              label={about?.eyebrow || "About Sunpilot"}
              title={about?.title || "Practical blind solutions with dependable service"}
              body={
                about?.subtitle ||
                "Sunpilot supports product selection, measurement guidance, order preparation, and delivery follow-up for homes, offices, and project spaces."
              }
            />
            <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
              {about?.body ||
                "Every order is handled with attention to fit, finish, measurement accuracy, and practical coordination so customers can buy with confidence."}
            </p>
            <div className="mt-6 grid gap-3">
              {serviceCards.map((service) => (
                <article key={service.id} className="rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-accent)] px-4 py-4">
                  <p className="text-sm font-bold text-[var(--color-ink)]">{service.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{service.description}</p>
                </article>
              ))}
            </div>
          </article>

          <article id="contact" className="ui-panel-soft p-7 sm:p-8">
            <SectionTitle
              label={contactSection?.eyebrow || "Contact"}
              title={contactSection?.title || "Talk to Sunpilot about your space"}
              body={contactSection?.subtitle || contactSection?.body || "Customers can still reach the team directly for product enquiries, order support, and measurement guidance."}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="ui-panel p-4">
                <p className="ui-section-label">Phone</p>
                <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
                  {contact?.phone1 || "Customer support available"}
                </p>
              </div>
              <div className="ui-panel p-4">
                <p className="ui-section-label">Address</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {contact?.address || "Onitsha, Anambra State"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/checkout/order" className="ui-button ui-button-primary">
                Start Order
              </Link>
              <Link href="/notifications" className="ui-button ui-button-outline">
                View Updates
              </Link>
            </div>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
