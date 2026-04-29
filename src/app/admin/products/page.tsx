import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { CreateProductPanel } from "@/components/admin/create-product-panel";
import { ProductAdminCard } from "@/components/admin/product-admin-card";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCompactNumber } from "@/lib/utils";

export default async function AdminProductsPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const products = await getAdminProducts();
  const listedCount = products.filter((product) => product.isListed).length;
  const actionsEnabled = Boolean(admin);

  return (
    <AdminShell
      admin={admin}
      active="products"
      title="Product library"
      subtitle="Create, edit, price, publish, and maintain blind products without mixing product work into orders or support."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Listed products
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(listedCount)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Total products
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(products.length)}
          </p>
        </div>
      </section>

      <CreateProductPanel actionsEnabled={actionsEnabled} />

      {products.length ? (
        <section className="grid gap-5 xl:grid-cols-2">
          {products.map((product) => (
            <ProductAdminCard
              key={product.id}
              product={product}
              actionsEnabled={actionsEnabled}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <ShoppingBag size={30} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
            No products yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Create the first product listing above.
          </p>
        </section>
      )}
    </AdminShell>
  );
}
