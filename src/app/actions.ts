"use server";

import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  hasPublicSupabaseConfig,
  hasServiceRoleConfig,
} from "@/lib/supabase/env";
import type {
  ActionFeedbackState,
  AdminAuthActionState,
  OfflineOrderActionState,
  OrderStatus,
} from "@/lib/types";
import { buildOrderReference, sanitizeFileName, slugify } from "@/lib/utils";

function isChecked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function buildEntityId(prefix: string, source: string) {
  const base = slugify(source) || prefix;
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${base}-${suffix}`;
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/site-settings");
  revalidatePath("/admin/login");
}

function revalidateCatalog(slug?: string | null) {
  revalidateSite();
  revalidatePath("/catalog");
  if (slug) {
    revalidatePath(`/products/${slug}`);
    revalidatePath(`/blinds/${slug}`);
  }
}

function getRedirectPath(formData: FormData, fallback: string) {
  const redirectTo = getText(formData, "redirectTo");
  return redirectTo || fallback;
}

async function requireAdminSupabase() {
  if (!hasPublicSupabaseConfig) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("is_active")
    .eq("user_id", user.id)
    .maybeSingle<{ is_active: boolean | null }>();

  if (!adminProfile?.is_active) {
    return null;
  }

  return supabase;
}

async function resolveMediaUrl({
  supabase,
  formData,
  fileKey,
  urlKey,
  currentUrlKey,
  folder,
  removeKey = "removeMedia",
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  formData: FormData;
  fileKey: string;
  urlKey: string;
  currentUrlKey: string;
  folder: string;
  removeKey?: string;
}) {
  if (isChecked(formData, removeKey)) {
    return null;
  }

  const directUrl = getText(formData, urlKey);
  if (directUrl) {
    return directUrl;
  }

  const uploadedFile = formData.get(fileKey);
  if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
    return getText(formData, currentUrlKey) || null;
  }

  const safeName = sanitizeFileName(uploadedFile.name || "site-media");
  const uploadPath = `${folder}/${Date.now()}-${safeName}`;
  const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

  const { error } = await supabase.storage.from("site-media").upload(
    uploadPath,
    fileBuffer,
    {
      contentType: uploadedFile.type || "application/octet-stream",
      upsert: true,
    },
  );

  if (error) {
    throw new Error(`Media upload failed for ${folder}.`);
  }

  const { data } = supabase.storage.from("site-media").getPublicUrl(uploadPath);
  return data.publicUrl;
}

function splitList(rawValue: FormDataEntryValue | null) {
  return String(rawValue ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function buildProductInput({
  supabase,
  formData,
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  formData: FormData;
}) {
  const name = getText(formData, "name");
  const collection = getText(formData, "collection");
  const shortDescription = getText(formData, "shortDescription");
  const description = getText(formData, "description");
  const leadTime = getText(formData, "leadTime");
  const slug = getText(formData, "slug") || slugify(name);
  const basePrice = getNumber(formData, "basePrice");

  if (
    !name ||
    !slug ||
    !collection ||
    !shortDescription ||
    !description ||
    !leadTime ||
    !basePrice
  ) {
    return null;
  }

  const imageUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "imageFile",
    urlKey: "imageUrl",
    currentUrlKey: "currentImageUrl",
    folder: "products",
    removeKey: "removeImage",
  });

  return {
    slug,
    name,
    collection,
    short_description: shortDescription,
    description,
    image_url: imageUrl,
    base_price: basePrice,
    sale_price: getText(formData, "salePrice")
      ? Number(getText(formData, "salePrice"))
      : null,
    lead_time: leadTime,
    rating: getNumber(formData, "rating") || 5,
    review_count: getNumber(formData, "reviewCount"),
    badge: getText(formData, "badge") || null,
    is_listed: isChecked(formData, "isListed"),
    measurements: splitList(formData.get("measurements")),
    colors: splitList(formData.get("colors")),
    features: splitList(formData.get("features")),
    ideal_for: splitList(formData.get("idealFor")),
    visual_from: getText(formData, "visualFrom") || "#d7e3f1",
    visual_to: getText(formData, "visualTo") || "#0A2540",
    visual_accent: getText(formData, "visualAccent") || "#D4AF37",
    visual_label: getText(formData, "visualLabel") || collection,
  };
}

export async function submitOfflineOrder(
  _previousState: OfflineOrderActionState,
  formData: FormData,
): Promise<OfflineOrderActionState> {
  try {
    const sessionSupabase = hasPublicSupabaseConfig
      ? await createSupabaseServerClient()
      : null;
    const {
      data: { user },
    } = sessionSupabase ? await sessionSupabase.auth.getUser() : { data: { user: null } };
    const customerName = getText(formData, "customerName");
    const phone = getText(formData, "phone");
    const email = getText(formData, "email");
    const location = getText(formData, "location");
    const state = getText(formData, "state");
    const width = getText(formData, "width");
    const height = getText(formData, "height");
    const quantity = getNumber(formData, "quantity") || 1;
    const color = getText(formData, "color");
    const mountType = getText(formData, "mountType");
    const controlSide = getText(formData, "controlSide");
    const notes = getText(formData, "notes");
    const productId = getText(formData, "productId");
    const productSlug = getText(formData, "productSlug");
    const productName = getText(formData, "productName");
    const unitAmount = getNumber(formData, "unitAmount");
    const totalAmount = unitAmount * quantity;
    const paymentProof = formData.get("paymentProof");

    if (
      !customerName ||
      !phone ||
      !location ||
      !state ||
      !width ||
      !height ||
      !color ||
      !mountType ||
      !controlSide ||
      !productId ||
      !productName
    ) {
      return {
        status: "error",
        message: "Fill every required order field before submitting.",
      };
    }

    if (!(paymentProof instanceof File) || paymentProof.size === 0) {
      return {
        status: "error",
        message: "Upload your proof of payment before submitting the order.",
      };
    }

    if (paymentProof.size > 5 * 1024 * 1024) {
      return {
        status: "error",
        message: "Payment proof must be 5MB or less.",
      };
    }

    const reference = buildOrderReference();

    if (!hasServiceRoleConfig) {
      return {
        status: "success",
        message:
          "Preview mode recorded the order flow. Add the Supabase service key to persist real orders and uploads.",
        orderReference: reference,
      };
    }

    const supabase = createSupabaseServiceClient();

    if (!supabase) {
      return {
        status: "error",
        message: "Supabase service connection is unavailable.",
      };
    }

    const safeName = sanitizeFileName(paymentProof.name || "payment-proof");
    const uploadPath = `${reference}/${Date.now()}-${safeName}`;
    const proofBuffer = Buffer.from(await paymentProof.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(uploadPath, proofBuffer, {
        contentType: paymentProof.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return {
        status: "error",
        message: "Payment proof upload failed. Try again.",
      };
    }

    const { error: insertError } = await supabase.from("orders").insert({
      reference,
      customer_user_id: user?.id ?? null,
      customer_name: customerName,
      customer_phone: phone,
      customer_email: email || user?.email || null,
      product_id: productId,
      product_slug: productSlug,
      product_name: productName,
      total_amount: totalAmount,
      quantity,
      delivery_state: state,
      delivery_address: location,
      width,
      height,
      selected_color: color,
      mount_type: mountType,
      control_side: controlSide,
      notes: notes || null,
      payment_proof_path: uploadPath,
      status: "pending",
    });

    if (insertError) {
      return {
        status: "error",
        message: "Order could not be saved. Check Supabase table setup and try again.",
      };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/checkout/offline");
    revalidatePath("/account");

    return {
      status: "success",
      message:
        "Order received. Our admin team will verify your payment and continue processing.",
      orderReference: reference,
    };
  } catch (error) {
    console.error("submitOfflineOrder failed", error);

    return {
      status: "error",
      message:
        "Order submission failed before it could complete. Try again, and use a smaller proof file if the issue continues.",
    };
  }
}

export async function signInAdmin(
  _previousState: AdminAuthActionState,
  formData: FormData,
): Promise<AdminAuthActionState> {
  if (!hasPublicSupabaseConfig) {
    return {
      status: "error",
      message:
        "Supabase auth is not configured yet. Add the environment keys to enable admin login.",
    };
  }

  const email = getText(formData, "email");
  const password = getText(formData, "password");

  if (!email || !password) {
    return {
      status: "error",
      message: "Enter the admin email and password.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      status: "error",
      message: "Admin sign-in failed. Check the credentials.",
    };
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("is_active")
    .eq("user_id", data.user.id)
    .maybeSingle<{ is_active: boolean | null }>();

  if (!adminProfile?.is_active) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "This user is not marked as an active admin in Supabase.",
    };
  }

  redirect("/admin/dashboard");
}

export async function signInCustomer(
  _previousState: ActionFeedbackState,
  formData: FormData,
): Promise<ActionFeedbackState> {
  if (!hasPublicSupabaseConfig) {
    return {
      status: "error",
      message: "Supabase auth is not configured yet.",
    };
  }

  const email = getText(formData, "email");
  const password = getText(formData, "password");

  if (!email || !password) {
    return {
      status: "error",
      message: "Enter your email and password.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Sign-in failed. Check the credentials and try again.",
    };
  }

  redirect(getRedirectPath(formData, "/account"));
}

export async function signUpCustomer(
  _previousState: ActionFeedbackState,
  formData: FormData,
): Promise<ActionFeedbackState> {
  if (!hasPublicSupabaseConfig) {
    return {
      status: "error",
      message: "Supabase auth is not configured yet.",
    };
  }

  const fullName = getText(formData, "fullName");
  const email = getText(formData, "email");
  const password = getText(formData, "password");
  const confirmPassword = getText(formData, "confirmPassword");

  if (!fullName || !email || !password || !confirmPassword) {
    return {
      status: "error",
      message: "Complete every field before creating your account.",
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Use a password with at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "Passwords do not match.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message || "Account creation failed.",
    };
  }

  if (!data.session) {
    return {
      status: "success",
      message:
        "Account created. Confirm your email if required, then sign in to view future orders.",
    };
  }

  redirect(getRedirectPath(formData, "/account"));
}

export async function signOutCustomer() {
  if (hasPublicSupabaseConfig) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/account");
}

export async function signOutAdmin() {
  if (hasPublicSupabaseConfig) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

export async function resetAdminPassword(
  _previousState: ActionFeedbackState,
  formData: FormData,
): Promise<ActionFeedbackState> {
  if (!hasServiceRoleConfig) {
    return {
      status: "error",
      message: "Add the Supabase service role key to enable password resets.",
    };
  }

  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin || currentAdmin.role !== "super_admin") {
    return {
      status: "error",
      message: "Only a super admin can reset admin passwords.",
    };
  }

  const email = getText(formData, "email").toLowerCase();
  const password = getText(formData, "password");

  if (!email || !password) {
    return {
      status: "error",
      message: "Enter the target admin email and the new password.",
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Use a password with at least 8 characters.",
    };
  }

  const serviceSupabase = createSupabaseServiceClient();

  if (!serviceSupabase) {
    return {
      status: "error",
      message: "Supabase service connection is unavailable.",
    };
  }

  const { data: userPage, error: listError } =
    await serviceSupabase.auth.admin.listUsers();

  if (listError) {
    return {
      status: "error",
      message: "Could not load admin users from Supabase Auth.",
    };
  }

  const targetUser = userPage.users.find(
    (user) => user.email?.toLowerCase() === email,
  );

  if (!targetUser) {
    return {
      status: "error",
      message: "No Supabase Auth user was found for that email.",
    };
  }

  const { data: adminProfile } = await serviceSupabase
    .from("admin_profiles")
    .select("is_active")
    .eq("user_id", targetUser.id)
    .maybeSingle<{ is_active: boolean | null }>();

  if (!adminProfile?.is_active) {
    return {
      status: "error",
      message: "That user is not an active admin profile.",
    };
  }

  const { error: updateError } = await serviceSupabase.auth.admin.updateUserById(
    targetUser.id,
    { password },
  );

  if (updateError) {
    return {
      status: "error",
      message: "Password reset failed. Check the service-role configuration.",
    };
  }

  return {
    status: "success",
    message: `Password updated for ${email}.`,
  };
}

export async function saveProductPricing(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const productId = getText(formData, "productId");
  const basePrice = getNumber(formData, "basePrice");
  const rawSalePrice = getText(formData, "salePrice");
  const slug = getText(formData, "slug");

  if (!supabase || !productId) {
    return;
  }

  await supabase
    .from("products")
    .update({
      base_price: basePrice,
      sale_price: rawSalePrice ? Number(rawSalePrice) : null,
    })
    .eq("id", productId);

  revalidateCatalog(slug);
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const input = await buildProductInput({ supabase, formData });

  if (!input) {
    return;
  }

  await supabase.from("products").insert(input);
  revalidateCatalog(input.slug);
}

export async function upsertProduct(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const productId = getText(formData, "id");
  const currentSlug = getText(formData, "currentSlug");

  if (!supabase) {
    return;
  }

  const input = await buildProductInput({ supabase, formData });

  if (!input) {
    return;
  }

  if (productId) {
    await supabase.from("products").update(input).eq("id", productId);
  } else {
    await supabase.from("products").insert(input);
  }

  revalidateCatalog(input.slug);

  if (currentSlug && currentSlug !== input.slug) {
    revalidateCatalog(currentSlug);
  }
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const productId = getText(formData, "id");
  const slug = getText(formData, "currentSlug") || getText(formData, "slug");

  if (!supabase || !productId) {
    return;
  }

  await supabase.from("products").delete().eq("id", productId);
  revalidateCatalog(slug);
}

export async function toggleProductListing(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const productId = getText(formData, "productId");
  const nextState = getText(formData, "nextState") === "true";
  const slug = getText(formData, "slug");

  if (!supabase || !productId) {
    return;
  }

  await supabase.from("products").update({ is_listed: nextState }).eq("id", productId);

  revalidateCatalog(slug);
}

export async function toggleDeliveryState(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const code = getText(formData, "code");
  const nextState = getText(formData, "nextState") === "true";

  if (!supabase || !code) {
    return;
  }

  await supabase
    .from("delivery_states")
    .update({ is_active: nextState })
    .eq("code", code);

  revalidatePath("/checkout/offline");
  revalidatePath("/admin/dashboard");
}

export async function upsertDeliveryState(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const oldCode = getText(formData, "oldCode");
  const name = getText(formData, "name");
  const code = getText(formData, "code") || slugify(name);

  if (!supabase || !name || !code) {
    return;
  }

  await supabase.from("delivery_states").upsert({
    code,
    name,
    eta: getText(formData, "eta") || "3 to 6 working days",
    is_active: isChecked(formData, "isActive"),
  });

  if (oldCode && oldCode !== code) {
    await supabase.from("delivery_states").delete().eq("code", oldCode);
  }

  revalidatePath("/checkout/offline");
  revalidatePath("/admin/dashboard");
}

export async function deleteDeliveryState(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const code = getText(formData, "oldCode") || getText(formData, "code");

  if (!supabase || !code) {
    return;
  }

  await supabase.from("delivery_states").delete().eq("code", code);
  revalidatePath("/checkout/offline");
  revalidatePath("/admin/dashboard");
}

export async function savePaymentAccount(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  await supabase.from("site_settings").upsert({
    id: "default",
    bank_name: getText(formData, "bankName"),
    account_name: getText(formData, "accountName"),
    account_number: getText(formData, "accountNumber"),
    payment_note: getText(formData, "paymentNote"),
  });

  revalidatePath("/checkout/offline");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/site-settings");
}

export async function saveSiteSettings(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const logoUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "logoFile",
    urlKey: "logoUrl",
    currentUrlKey: "currentLogoUrl",
    folder: "branding",
    removeKey: "removeLogo",
  });

  await supabase.from("site_settings").upsert({
    id: "default",
    brand_name: getText(formData, "brandName"),
    short_name: getText(formData, "shortName"),
    tagline: getText(formData, "tagline"),
    logo_url: logoUrl,
    footer_note: getText(formData, "footerNote"),
    primary_color: getText(formData, "primaryColor"),
    secondary_color: getText(formData, "secondaryColor"),
    accent_color: getText(formData, "accentColor"),
    page_color: getText(formData, "pageColor"),
    surface_color: getText(formData, "surfaceColor"),
    ink_color: getText(formData, "inkColor"),
    muted_color: getText(formData, "mutedColor"),
    line_color: getText(formData, "lineColor"),
  });

  revalidateSite();
}

export async function saveContactInfo(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  await supabase.from("contact_info").upsert({
    id: "default",
    phone_1: getText(formData, "phone1"),
    phone_2: getText(formData, "phone2") || null,
    whatsapp_number: getText(formData, "whatsappNumber"),
    email: getText(formData, "email") || null,
    address: getText(formData, "address"),
  });

  revalidateSite();
}

export async function saveSiteSection(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const sectionKey = getText(formData, "sectionKey");

  if (!sectionKey) {
    return;
  }

  const mediaUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "mediaFile",
    urlKey: "mediaUrl",
    currentUrlKey: "currentMediaUrl",
    folder: `sections/${sectionKey}`,
  });

  await supabase.from("site_sections").upsert({
    section_key: sectionKey,
    eyebrow: getText(formData, "eyebrow") || null,
    title: getText(formData, "title"),
    subtitle: getText(formData, "subtitle") || null,
    body: getText(formData, "body") || null,
    primary_cta_label: getText(formData, "primaryCtaLabel") || null,
    primary_cta_link: getText(formData, "primaryCtaLink") || null,
    secondary_cta_label: getText(formData, "secondaryCtaLabel") || null,
    secondary_cta_link: getText(formData, "secondaryCtaLink") || null,
    media_url: mediaUrl,
    media_kind:
      getText(formData, "mediaKind") === "video" ? "video" : "image",
    media_alt: getText(formData, "mediaAlt") || null,
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function upsertNavbarItem(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const title = getText(formData, "title");
  const link = getText(formData, "link");

  if (!title || !link) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("nav", title);

  await supabase.from("navbar").upsert({
    id,
    title,
    link,
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteNavbarItem(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("navbar").delete().eq("id", id);
  revalidateSite();
}

export async function upsertSocialLink(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const platform = getText(formData, "platform");
  const url = getText(formData, "url");
  const displayName = getText(formData, "displayName");

  if (!platform || !url || !displayName) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("social", platform);

  await supabase.from("social_links").upsert({
    id,
    platform,
    url,
    display_name: displayName,
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteSocialLink(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("social_links").delete().eq("id", id);
  revalidateSite();
}

export async function upsertHighlight(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const title = getText(formData, "title");
  const description = getText(formData, "description");

  if (!title || !description) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("highlight", title);

  await supabase.from("site_highlights").upsert({
    id,
    title,
    description,
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteHighlight(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("site_highlights").delete().eq("id", id);
  revalidateSite();
}

export async function upsertService(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const title = getText(formData, "title");
  const description = getText(formData, "description");

  if (!title || !description) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("service", title);
  const imageUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "imageFile",
    urlKey: "imageUrl",
    currentUrlKey: "currentImageUrl",
    folder: "services",
  });

  await supabase.from("services").upsert({
    id,
    title,
    description,
    image_url: imageUrl,
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteService(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("services").delete().eq("id", id);
  revalidateSite();
}

export async function upsertTeamMember(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const name = getText(formData, "name");
  const role = getText(formData, "role");

  if (!name || !role) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("team", name);
  const imageUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "imageFile",
    urlKey: "imageUrl",
    currentUrlKey: "currentImageUrl",
    folder: "team",
  });

  await supabase.from("team_members").upsert({
    id,
    name,
    role,
    bio: getText(formData, "bio") || null,
    image_url: imageUrl,
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteTeamMember(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("team_members").delete().eq("id", id);
  revalidateSite();
}

export async function upsertClient(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const name = getText(formData, "name");
  if (!name) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("client", name);
  const logoUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "logoFile",
    urlKey: "logoUrl",
    currentUrlKey: "currentLogoUrl",
    folder: "clients",
    removeKey: "removeLogo",
  });

  await supabase.from("clients").upsert({
    id,
    name,
    logo_url: logoUrl,
    website_url: getText(formData, "websiteUrl") || null,
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteClient(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("clients").delete().eq("id", id);
  revalidateSite();
}

export async function upsertGalleryItem(formData: FormData) {
  const supabase = await requireAdminSupabase();

  if (!supabase) {
    return;
  }

  const title = getText(formData, "title");
  if (!title) {
    return;
  }

  const id = getText(formData, "id") || buildEntityId("gallery", title);
  const mediaUrl = await resolveMediaUrl({
    supabase,
    formData,
    fileKey: "mediaFile",
    urlKey: "mediaUrl",
    currentUrlKey: "currentMediaUrl",
    folder: "gallery",
  });

  await supabase.from("gallery_items").upsert({
    id,
    title,
    description: getText(formData, "description") || null,
    media_url: mediaUrl,
    media_kind:
      getText(formData, "mediaKind") === "video" ? "video" : "image",
    sort_order: getNumber(formData, "sortOrder"),
    is_active: isChecked(formData, "isActive"),
  });

  revalidateSite();
}

export async function deleteGalleryItem(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getText(formData, "id");

  if (!supabase || !id) {
    return;
  }

  await supabase.from("gallery_items").delete().eq("id", id);
  revalidateSite();
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const orderId = getText(formData, "orderId");
  const status = getText(formData, "status") as OrderStatus;

  if (!supabase || !orderId || !status) {
    return;
  }

  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/dashboard");
  revalidatePath("/account");
}
