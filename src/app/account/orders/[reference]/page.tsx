import { redirect } from "next/navigation";

export default async function AccountOrderRedirectPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  redirect(`/orders/${reference}`);
}
