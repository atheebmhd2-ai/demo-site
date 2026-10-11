import { createClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { businessInfo, galleryImages, menuItems, seoSettings, testimonials } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export type MenuItem = typeof menuItems.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type BusinessInfo = typeof businessInfo.$inferSelect;
export type SeoSetting = typeof seoSettings.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;

import { PAGE_KEYS } from "./seo-pages";
export { PAGE_KEYS, PAGE_LABELS } from "./seo-pages";
export type { PageKey } from "./seo-pages";
import type { PageKey } from "./seo-pages";

export const defaultBusiness: BusinessInfo = {
  id: "main", name: "Grind", tagline: "Good coffee. Better moments.",
  story: "We believe the best days begin with a good cup and a little time to enjoy it. At Grind, every detail matters—from the beans we source to the people we share them with. Come as you are, stay as long as you like.",
  address: "127 Waverly Place", city: "New York, NY 10014", hoursWeekday: "Mon – Fri  ·  7:00 AM – 6:00 PM", hoursWeekend: "Sat – Sun  ·  8:00 AM – 5:00 PM",
  phone: "+1 (212) 555-0184", email: "hello@grindcoffee.co", instagram: "https://instagram.com/", announcement: "Your daily ritual, reimagined.",
  heroImageUrl: "https://images.pexels.com/photos/19571937/pexels-photo-19571937.jpeg?auto=compress&cs=tinysrgb&w=1800",
  heroImageAlt: "Barista preparing coffee at the espresso machine in a warmly lit café.",
  storyImageUrl: "https://images.pexels.com/photos/5812847/pexels-photo-5812847.jpeg?auto=compress&cs=tinysrgb&w=1200",
  storyImageAlt: "Rustic coffee shop counter with a chalkboard menu.",
};

// Fixed ids keep first-run seeding idempotent: Next.js can invoke generateMetadata
// for several routes concurrently during build/request, and without a stable id,
// concurrent inserts into tables with no natural unique key would duplicate rows.
const defaultMenuData = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Honey Oat Latte", description: "Double espresso, velvety oat milk, local honey & a whisper of cinnamon.", category: "Coffee", price: 650, imageUrl: "https://images.pexels.com/photos/8259495/pexels-photo-8259495.jpeg?auto=compress&cs=tinysrgb&w=900", imageAlt: "Honey oat latte with latte art in a glass cup.", featured: true, available: true, sortOrder: 1 },
  { id: "00000000-0000-4000-8000-000000000002", name: "Maple Cold Brew", description: "Slow-steeped for 18 hours, finished with maple cold foam.", category: "Coffee", price: 575, imageUrl: "https://images.pexels.com/photos/38895653/pexels-photo-38895653.jpeg?auto=compress&cs=tinysrgb&w=900", imageAlt: "Maple cold brew coffee in a rounded glass.", featured: true, available: true, sortOrder: 2 },
  { id: "00000000-0000-4000-8000-000000000003", name: "Ceremonial Matcha", description: "Stone-ground matcha whisked to order with your milk of choice.", category: "Non-Coffee", price: 625, imageUrl: "https://images.pexels.com/photos/5946970/pexels-photo-5946970.jpeg?auto=compress&cs=tinysrgb&w=900", imageAlt: "Ceremonial matcha latte with foam art.", featured: true, available: true, sortOrder: 3 },
  { id: "00000000-0000-4000-8000-000000000004", name: "Brown Butter Cookie", description: "Crisp edges, soft center, dark chocolate and flaky sea salt.", category: "Bakery", price: 425, imageUrl: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=900", imageAlt: "Brown butter cookie with chocolate chunks.", featured: true, available: true, sortOrder: 4 },
  { id: "00000000-0000-4000-8000-000000000005", name: "Classic Cappuccino", description: "Our house espresso with silky steamed milk and a cloud of foam.", category: "Coffee", price: 525, imageUrl: "https://images.pexels.com/photos/32228894/pexels-photo-32228894.jpeg?auto=compress&cs=tinysrgb&w=900", imageAlt: "Cappuccino with latte art on a dark table.", featured: false, available: true, sortOrder: 5 },
  { id: "00000000-0000-4000-8000-000000000006", name: "Almond Croissant", description: "Twice baked with almond cream and a generous dusting of sugar.", category: "Bakery", price: 495, imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=900", imageAlt: "Almond croissant dusted with powdered sugar.", featured: false, available: true, sortOrder: 6 },
];

const defaultTestimonialsData = [
  { id: "00000000-0000-4000-9000-000000000001", quote: "The kind of place you come for a coffee and end up staying all afternoon. Every little detail feels like it was made with care.", name: "Sophie M.", role: "Neighborhood regular", imageUrl: "", imageAlt: "", featured: true, sortOrder: 1 },
  { id: "00000000-0000-4000-9000-000000000002", quote: "Easily the best oat latte in the city. The space is beautiful, the people are lovely, and the coffee never misses.", name: "Daniel R.", role: "Coffee enthusiast", imageUrl: "", imageAlt: "", featured: true, sortOrder: 2 },
  { id: "00000000-0000-4000-9000-000000000003", quote: "Grind has become my favorite part of the morning. It feels less like a coffee shop and more like a little pause in the day.", name: "Alex T.", role: "Early bird", imageUrl: "", imageAlt: "", featured: true, sortOrder: 3 },
];

const defaultGalleryData = [
  { id: "00000000-0000-4000-a000-000000000001", imageUrl: "https://images.pexels.com/photos/32228894/pexels-photo-32228894.jpeg?auto=compress&cs=tinysrgb&w=1200", altText: "Latte art in a white cup on a dark wooden table.", sortOrder: 1 },
  { id: "00000000-0000-4000-a000-000000000002", imageUrl: "https://images.pexels.com/photos/39016539/pexels-photo-39016539.jpeg?auto=compress&cs=tinysrgb&w=1200", altText: "Barista tools and tamper on the espresso counter.", sortOrder: 2 },
  { id: "00000000-0000-4000-a000-000000000003", imageUrl: "https://images.pexels.com/photos/5812847/pexels-photo-5812847.jpeg?auto=compress&cs=tinysrgb&w=1200", altText: "Rustic coffee shop counter with a chalkboard menu.", sortOrder: 3 },
  { id: "00000000-0000-4000-a000-000000000004", imageUrl: "https://images.pexels.com/photos/19373865/pexels-photo-19373865.jpeg?auto=compress&cs=tinysrgb&w=1200", altText: "Baristas preparing coffee behind the counter.", sortOrder: 4 },
];

export const defaultSeo: Record<PageKey, Omit<SeoSetting, "pageKey">> = {
  home: { seoTitle: "Grind Coffee | Good coffee. Better moments.", metaDescription: "Thoughtfully crafted coffee, genuinely good people, and a place that feels like yours. Visit Grind Coffee in New York.", h1: "Life happens. Coffee helps." },
  menu: { seoTitle: "Menu | Grind Coffee", metaDescription: "Browse coffee, bakery and seasonal favorites at Grind Coffee, made fresh every day in New York.", h1: "Our full menu." },
  story: { seoTitle: "Our Story | Grind Coffee", metaDescription: "Learn the story behind Grind Coffee and what makes our neighborhood coffee shop special.", h1: "Our little story." },
  gallery: { seoTitle: "Gallery | Grind Coffee", metaDescription: "A peek inside Grind Coffee — our space, our drinks, and our people.", h1: "A look inside." },
  contact: { seoTitle: "Visit Us | Grind Coffee", metaDescription: "Find our address, hours, and contact details to visit Grind Coffee in New York.", h1: "Come on in." },
};

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}
export const isSupabaseConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

function mapMenu(row: Record<string, unknown>): MenuItem {
  return { id: String(row.id), name: String(row.name), description: String(row.description ?? ""), category: String(row.category ?? "Coffee"), price: Number(row.price ?? 0), imageUrl: String(row.image_url ?? ""), imageAlt: String(row.image_alt ?? ""), featured: Boolean(row.featured), available: Boolean(row.available), sortOrder: Number(row.sort_order ?? 0), createdAt: new Date(String(row.created_at ?? Date.now())) };
}
function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return { id: String(row.id), quote: String(row.quote), name: String(row.name), role: String(row.role ?? ""), imageUrl: String(row.image_url ?? ""), imageAlt: String(row.image_alt ?? ""), featured: Boolean(row.featured), sortOrder: Number(row.sort_order ?? 0), createdAt: new Date(String(row.created_at ?? Date.now())) };
}
function mapBusiness(row: Record<string, unknown>): BusinessInfo {
  return { ...defaultBusiness, ...Object.fromEntries(Object.keys(defaultBusiness).map(k => [k, row[k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)] ?? defaultBusiness[k as keyof BusinessInfo]])) } as BusinessInfo;
}
function mapSeo(row: Record<string, unknown>): SeoSetting {
  return { pageKey: String(row.page_key) as PageKey, seoTitle: String(row.seo_title ?? ""), metaDescription: String(row.meta_description ?? ""), h1: String(row.h1 ?? "") };
}
function mapGallery(row: Record<string, unknown>): GalleryImage {
  return { id: String(row.id), imageUrl: String(row.image_url ?? ""), altText: String(row.alt_text ?? ""), sortOrder: Number(row.sort_order ?? 0), createdAt: new Date(String(row.created_at ?? Date.now())) };
}
function seoRecord(rows: SeoSetting[]): Record<PageKey, SeoSetting> {
  const byKey = new Map(rows.map(row => [row.pageKey, row]));
  return Object.fromEntries(PAGE_KEYS.map(key => [key, byKey.get(key) ?? { pageKey: key, ...defaultSeo[key] }])) as Record<PageKey, SeoSetting>;
}

async function seedLocal() {
  const [business, menu, quotes, seo, gallery] = await Promise.all([
    db.select({ id: businessInfo.id }).from(businessInfo).limit(1),
    db.select({ id: menuItems.id }).from(menuItems).limit(1),
    db.select({ id: testimonials.id }).from(testimonials).limit(1),
    db.select({ pageKey: seoSettings.pageKey }).from(seoSettings).limit(1),
    db.select({ id: galleryImages.id }).from(galleryImages).limit(1),
  ]);
  await Promise.all([
    business.length ? null : db.insert(businessInfo).values(defaultBusiness).onConflictDoNothing(),
    menu.length ? null : db.insert(menuItems).values(defaultMenuData).onConflictDoNothing(),
    quotes.length ? null : db.insert(testimonials).values(defaultTestimonialsData).onConflictDoNothing(),
    seo.length ? null : db.insert(seoSettings).values(PAGE_KEYS.map(key => ({ pageKey: key, ...defaultSeo[key] }))).onConflictDoNothing(),
    gallery.length ? null : db.insert(galleryImages).values(defaultGalleryData).onConflictDoNothing(),
  ]);
}

export async function getContent() {
  const client = supabase();
  if (client) {
    const [menuResult, testimonialResult, businessResult, seoResult, galleryResult] = await Promise.all([
      client.from("menu_items").select("*").order("sort_order"),
      client.from("testimonials").select("*").order("sort_order"),
      client.from("business_info").select("*").eq("id", "main").maybeSingle(),
      client.from("seo_settings").select("*"),
      client.from("gallery_images").select("*").order("sort_order"),
    ]);
    if (menuResult.error || testimonialResult.error || businessResult.error || seoResult.error || galleryResult.error) {
      throw new Error("Supabase content tables are not ready. Run the SQL in supabase/schema.sql.");
    }
    const needsSeed = !businessResult.data || !menuResult.data?.length || !testimonialResult.data?.length || !seoResult.data?.length || !galleryResult.data?.length;
    if (needsSeed) {
      const info = Object.fromEntries(Object.entries(defaultBusiness).map(([k, v]) => [k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`), v]));
      const [businessSeed, menuSeed, testimonialSeed, seoSeed, gallerySeed] = await Promise.all([
        businessResult.data ? Promise.resolve({ error: null }) : client.from("business_info").upsert(info, { onConflict: "id" }),
        menuResult.data?.length ? Promise.resolve({ error: null }) : client.from("menu_items").upsert(defaultMenuData.map(x => ({ id: x.id, name: x.name, description: x.description, category: x.category, price: x.price, image_url: x.imageUrl, image_alt: x.imageAlt, featured: x.featured, available: x.available, sort_order: x.sortOrder })), { onConflict: "id" }),
        testimonialResult.data?.length ? Promise.resolve({ error: null }) : client.from("testimonials").upsert(defaultTestimonialsData.map(x => ({ id: x.id, quote: x.quote, name: x.name, role: x.role, image_url: x.imageUrl, image_alt: x.imageAlt, featured: x.featured, sort_order: x.sortOrder })), { onConflict: "id" }),
        seoResult.data?.length ? Promise.resolve({ error: null }) : client.from("seo_settings").upsert(PAGE_KEYS.map(key => ({ page_key: key, seo_title: defaultSeo[key].seoTitle, meta_description: defaultSeo[key].metaDescription, h1: defaultSeo[key].h1 })), { onConflict: "page_key" }),
        galleryResult.data?.length ? Promise.resolve({ error: null }) : client.from("gallery_images").upsert(defaultGalleryData.map(x => ({ id: x.id, image_url: x.imageUrl, alt_text: x.altText, sort_order: x.sortOrder })), { onConflict: "id" }),
      ]);
      if (businessSeed.error || menuSeed.error || testimonialSeed.error || seoSeed.error || gallerySeed.error) throw new Error("Could not initialize Supabase content.");
      return getContent();
    }
    return {
      menu: (menuResult.data ?? []).map(mapMenu),
      testimonials: (testimonialResult.data ?? []).map(mapTestimonial),
      business: mapBusiness(businessResult.data),
      seo: seoRecord((seoResult.data ?? []).map(mapSeo)),
      gallery: (galleryResult.data ?? []).map(mapGallery),
    };
  }
  await seedLocal();
  const [menu, quotes, info, seo, gallery] = await Promise.all([
    db.select().from(menuItems).orderBy(asc(menuItems.sortOrder)),
    db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
    db.select().from(businessInfo).where(eq(businessInfo.id, "main")).limit(1),
    db.select().from(seoSettings),
    db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder)),
  ]);
  return { menu, testimonials: quotes, business: info[0] ?? defaultBusiness, seo: seoRecord(seo), gallery };
}

export async function saveMenuItem(id: string | null, values: Omit<MenuItem, "id" | "createdAt">) {
  const client = supabase();
  if (client) {
    const payload = { name: values.name, description: values.description, category: values.category, price: values.price, image_url: values.imageUrl, image_alt: values.imageAlt, featured: values.featured, available: values.available, sort_order: values.sortOrder };
    const result = id && !id.startsWith("sample-") ? await client.from("menu_items").update(payload).eq("id", id) : await client.from("menu_items").insert(payload);
    if (result.error) throw result.error;
  } else if (id) await db.update(menuItems).set(values).where(eq(menuItems.id, id));
  else await db.insert(menuItems).values(values);
}
export async function deleteMenuItem(id: string) {
  const client = supabase();
  if (client) { const result = await client.from("menu_items").delete().eq("id", id); if (result.error) throw result.error; }
  else await db.delete(menuItems).where(eq(menuItems.id, id));
}
export async function saveTestimonial(id: string | null, values: Omit<Testimonial, "id" | "createdAt">) {
  const client = supabase();
  if (client) {
    const payload = { quote: values.quote, name: values.name, role: values.role, image_url: values.imageUrl, image_alt: values.imageAlt, featured: values.featured, sort_order: values.sortOrder };
    const result = id && !id.startsWith("sample-") ? await client.from("testimonials").update(payload).eq("id", id) : await client.from("testimonials").insert(payload);
    if (result.error) throw result.error;
  } else if (id) await db.update(testimonials).set(values).where(eq(testimonials.id, id));
  else await db.insert(testimonials).values(values);
}
export async function deleteTestimonial(id: string) {
  const client = supabase();
  if (client) { const result = await client.from("testimonials").delete().eq("id", id); if (result.error) throw result.error; }
  else await db.delete(testimonials).where(eq(testimonials.id, id));
}
export async function saveBusiness(values: BusinessInfo) {
  const client = supabase();
  if (client) {
    const payload = Object.fromEntries(Object.entries(values).map(([k, v]) => [k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`), v]));
    const result = await client.from("business_info").upsert(payload, { onConflict: "id" });
    if (result.error) throw result.error;
  } else await db.insert(businessInfo).values(values).onConflictDoUpdate({ target: businessInfo.id, set: values });
}

export async function saveSeoSetting(pageKey: PageKey, values: { seoTitle: string; metaDescription: string; h1: string }) {
  const clamped = { seoTitle: values.seoTitle.slice(0, 60), metaDescription: values.metaDescription.slice(0, 160), h1: values.h1.slice(0, 200) };
  const client = supabase();
  if (client) {
    const result = await client.from("seo_settings").upsert({ page_key: pageKey, seo_title: clamped.seoTitle, meta_description: clamped.metaDescription, h1: clamped.h1 }, { onConflict: "page_key" });
    if (result.error) throw result.error;
  } else {
    await db.insert(seoSettings).values({ pageKey, ...clamped }).onConflictDoUpdate({ target: seoSettings.pageKey, set: clamped });
  }
}

export async function saveGalleryImage(id: string | null, values: Omit<GalleryImage, "id" | "createdAt">) {
  const client = supabase();
  if (client) {
    const payload = { image_url: values.imageUrl, alt_text: values.altText, sort_order: values.sortOrder };
    const result = id && !id.startsWith("sample-") ? await client.from("gallery_images").update(payload).eq("id", id) : await client.from("gallery_images").insert(payload);
    if (result.error) throw result.error;
  } else if (id) await db.update(galleryImages).set(values).where(eq(galleryImages.id, id));
  else await db.insert(galleryImages).values(values);
}
export async function deleteGalleryImage(id: string) {
  const client = supabase();
  if (client) { const result = await client.from("gallery_images").delete().eq("id", id); if (result.error) throw result.error; }
  else await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

export async function uploadPhoto(file: File) {
  if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) throw new Error("Please choose an image under 8MB.");
  const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const filename = `${crypto.randomUUID()}.${extension}`;
  const client = supabase();
  if (client) {
    const { error } = await client.storage.from("grind-media").upload(filename, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (error) throw error;
    return client.storage.from("grind-media").getPublicUrl(filename).data.publicUrl;
  }
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const path = join(process.cwd(), "public", "uploads");
  await mkdir(path, { recursive: true });
  await writeFile(join(path, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}
