import { redirect } from "next/navigation";

export default async function LegacyOfflineCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  redirect(
    params.product
      ? `/checkout/order?product=${encodeURIComponent(params.product)}`
      : "/checkout/order",
  );
}
