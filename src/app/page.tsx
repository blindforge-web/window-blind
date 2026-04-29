import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  MapPinned,
  PackageCheck,
  PhoneCall,
  ShoppingBag,
} from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { ProductVisual } from "@/components/store/product-visual";
import { getLandingPageData } from "@/lib/data";

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
        {eyebrow}
      </p>
      <h2 className="max-w-3xl text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
        {body}
      </p>
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
  const servicesSection = sections.services;
  const contactSection = sections.contact;
  const heroProduct = featuredProducts[0];

  return (
    <div id="top" className="min-h-screen">
      <SiteHeader />

      <main className="px-4 pt-6 sm:px-6 lg:px-10">
        <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(155deg,#ffffff,rgba(234,242,255,0.92))] p-6 shadow-[0_30px_70px_-42px_rgba(14,42,71,0.28)] sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_42%,white_58%)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">
                {hero?.eyebrow || "Made-to-measure blinds"}
              </span>
              {contact?.phone1 ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  <PhoneCall size={14} />
                  {contact.phone1}
                </span>
              ) : null}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-[-0.07em] text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
              {hero?.title || "Custom blinds customers can order online with confidence"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              {hero?.subtitle || settings?.tagline}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {hero?.body ||
                "Sunpilot helps homes, offices, and commercial spaces choose the right blind style, submit measurements, pay remotely, and track order progress from one clean customer flow."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_34px_-20px_rgba(15,76,151,0.72)]"
              >
                Browse products
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/checkout/order"
                className="rounded-full border border-[var(--color-line)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)]"
              >
                Start an order
              </Link>
              <Link
                href="/orders"
                className="rounded-full border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-accent)_64%,white_36%)] px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)]"
              >
                Track orders
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Live catalog
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{featuredProducts.length}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Featured styles ready to browse.</p>
              </article>
              <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Delivery states
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{deliveryStates.length}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Coverage visible before payment.</p>
              </article>
              <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Support flow
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">Remote</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Customers can order and pay without visiting physically.</p>
              </article>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,#f9fbff,#edf4ff)] p-4 shadow-[0_26px_60px_-40px_rgba(14,42,71,0.24)]">
              {heroProduct ? (
                <ProductVisual
                  product={heroProduct}
                  className="min-h-[26rem] bg-[linear-gradient(160deg,#f4f8ff,#dbe9ff)]"
                  mediaClassName="h-full w-full object-contain p-6"
                />
              ) : (
                <div className="flex min-h-[26rem] items-end rounded-[1.7rem] bg-[linear-gradient(155deg,#dce9ff,#0f4c97)] p-6 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                      Sunpilot online store
                    </p>
                    <p className="mt-3 max-w-sm text-3xl font-extrabold tracking-[-0.05em]">
                      A simpler storefront for selection, payment, and tracking.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.6rem] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_38px_-32px_rgba(14,42,71,0.2)]">
                <BadgeCheck size={18} className="text-[var(--color-primary)]" />
                <p className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                  Verified payment review
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  Receipts are uploaded online and checked before production moves ahead.
                </p>
              </article>
              <article className="rounded-[1.6rem] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_38px_-32px_rgba(14,42,71,0.2)]">
                <MapPinned size={18} className="text-[var(--color-primary)]" />
                <p className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                  Clear order tracking
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  Customers can return to see order IDs, tracking slugs, and delivery updates.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.7rem] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_40px_-34px_rgba(14,42,71,0.16)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Highlight
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-7xl">
          <SectionIntro
            eyebrow="How it works"
            title="A simple customer flow from browsing to delivery updates"
            body="We kept the storefront light and professional so customers can understand the process quickly and place orders without confusion."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse products",
                body: "Customers open the products screen, compare collections, and select the right blind for their space.",
                icon: ShoppingBag,
              },
              {
                step: "02",
                title: "Pay remotely",
                body: "They submit measurements, delivery details, and payment proof without needing to visit physically.",
                icon: CreditCard,
              },
              {
                step: "03",
                title: "Track progress",
                body: "Orders stay visible in the order screen and the notifications screen as the team confirms and delivers.",
                icon: PackageCheck,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_42px_-34px_rgba(14,42,71,0.18)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                      {item.step}
                    </span>
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
            <SectionIntro
              eyebrow={sections.products?.eyebrow || "Products"}
              title={sections.products?.title || "Blind styles customers can order online"}
              body={sections.products?.subtitle || sections.products?.body || "A small, clear catalog is better than too much noise. Customers should be able to move from browsing to ordering fast."}
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Full catalog
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_24px_56px_-38px_rgba(14,42,71,0.2)] sm:p-8">
            <SectionIntro
              eyebrow={about?.eyebrow || "About Sunpilot"}
              title={about?.title || "A company page that now sells, not just describes"}
              body={about?.subtitle || "Sunpilot supports customers with selection, measurement guidance, payment review, and order follow-up from one professional web experience."}
            />
            <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
              {about?.body ||
                "This rebuild turns the website into a working customer channel. People can discover products, start orders, pay by transfer, and return later for tracking without depending on a physical visit."}
            </p>
            <div className="mt-6 grid gap-3">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-[1.3rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-accent)_64%,white_36%)] px-4 py-4"
                >
                  <p className="text-sm font-bold text-[var(--color-ink)]">{service.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{service.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(155deg,color-mix(in_srgb,var(--color-primary)_94%,white_6%),color-mix(in_srgb,var(--color-primary)_64%,white_36%))] p-7 text-white shadow-[0_26px_60px_-40px_rgba(14,42,71,0.32)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/68">
                Company promise
              </p>
              <h3 className="mt-4 text-4xl font-extrabold tracking-[-0.05em]">
                {servicesSection?.title || "Support for selection, measurement, supply, and delivery"}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/80">
                {servicesSection?.subtitle || servicesSection?.body || "Sunpilot keeps the process practical from first enquiry to the final delivery update."}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {teamMembers.slice(0, 4).map((member) => (
                  <div key={member.id} className="rounded-[1.2rem] border border-white/12 bg-white/10 px-4 py-4">
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="mt-2 text-sm text-white/72">{member.role}</p>
                  </div>
                ))}
              </div>
            </article>

            <article id="contact" className="rounded-[2rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)] sm:p-8">
              <SectionIntro
                eyebrow={contactSection?.eyebrow || "Contact"}
                title={contactSection?.title || "Talk to Sunpilot about your space"}
                body={contactSection?.subtitle || contactSection?.body || "Customers can reach the team for product enquiries, order support, and measurement guidance."}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-accent)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    Phone
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
                    {contact?.phone1 || "Customer support available"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    Address
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {contact?.address || "Onitsha, Anambra State"}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/checkout/order"
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Start order
                </Link>
                <Link
                  href="/notifications"
                  className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                >
                  View notifications
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
