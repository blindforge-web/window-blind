import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatStatusLabel(status: string) {
  return status
    .split(/[-_]/)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function getOrderStatusMeta(status: string) {
  switch (status) {
    case "paid":
      return {
        label: "Payment confirmed",
        summary: "Your payment has been confirmed and the order is moving into production.",
      };
    case "paid_delivered":
      return {
        label: "Delivered",
        summary: "This order has been completed and marked as delivered.",
      };
    case "pending":
    default:
      return {
        label: "Payment review",
        summary: "Your order is in and the receipt is waiting for review by the Sunpilot team.",
      };
  }
}

export function buildOrderReference() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SP-${stamp}-${suffix}`;
}

export function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildTrackingSlug(productSlug: string, reference: string) {
  return slugify(`${productSlug}-${reference}`);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join("");
}
