import Link from "next/link";
import { ArrowRight, CreditCard, MapPin, PackageCheck, PhoneCall, Sparkles, Users } from "lucide-react";
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
  const { settings, contact, sections, featuredProducts, services, teamMembers, deliveryStates } =
    await getLandingPageData();

  const hero = sections.hero;
  const about = sections.about;
  const contactSection = sections.contact;
  const teamSection = sections.team;
  const heroProduct = featuredProducts[0];

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
              {hero?.title || "A simpler Sunpilot website customers can actually use"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              {hero?.subtitle || settings?.tagline}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {hero?.body ||
                "Customers can browse products, place orders, pay remotely, and come back later for updates without needing to visit physically first."}
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
                <p className="mt-2 text-sm text-[var(--color-muted)]">Fast-to-browse collections.</p>
              </article>
              <article className="ui-panel p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Delivery states
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{deliveryStates.length}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Visible before checkout.</p>
              </article>
              <article className="ui-panel p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Ordering
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">Remote</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Pay and submit proof online.</p>
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
                      Sunpilot online store
                    </p>
                    <p className="mt-3 max-w-sm text-3xl font-extrabold tracking-[-0.05em]">
                      Cleaner pages, clearer buttons, easier product ordering.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="ui-panel p-5">
                <Sparkles size={18} className="text-[var(--color-primary)]" />
                <p className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                  Very simple navigation
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  Home, Products, Team, Contact, plus direct buttons for orders and account.
                </p>
              </article>
              <article className="ui-panel p-5">
                <PackageCheck size={18} className="text-[var(--color-primary)]" />
                <p className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                  Easy remote checkout
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  Clear pricing, guided order flow, and visible next steps after payment proof upload.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl">
          <SectionTitle
            label="How It Works"
            title="Three simple steps from browsing to delivery updates"
            body="We stripped the flow down so customers can understand what to do at first glance."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse products",
                body: "Open the product screen, compare blind styles, and pick the option that fits the space.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Submit order and payment",
                body: "Enter measurements, delivery details, and upload transfer proof in one clean checkout flow.",
                icon: CreditCard,
              },
              {
                step: "03",
                title: "Follow updates",
                body: "Use the orders and notifications screens to follow confirmation and delivery progress.",
                icon: MapPin,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="ui-panel p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="ui-section-label">{item.step}</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                      <Icon size={18} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="products" className="mx-auto mt-14 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              label="Products"
              title={sections.products?.title || "Blind styles customers can browse quickly"}
              body={sections.products?.subtitle || sections.products?.body || "A small, easy catalog is better than a busy storefront. We kept the product cards clear and direct."}
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
              body={teamSection?.subtitle || teamSection?.body || "Swipe across the team section, then open the full page to see every member and their details one after another."}
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
              title={about?.title || "A company website that now works like a real storefront"}
              body={about?.subtitle || "Sunpilot supports product selection, measurement guidance, payment review, and delivery follow-up from one professional online flow."}
            />
            <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
              {about?.body ||
                "The goal of this redesign is simple: fewer confusing sections, more direct customer actions, and a cleaner path to buying blinds online."}
            </p>
            <div className="mt-6 grid gap-3">
              {services.slice(0, 3).map((service) => (
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
