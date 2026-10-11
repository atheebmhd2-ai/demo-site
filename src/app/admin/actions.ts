"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getOwner, logoutOwner } from "@/lib/auth";
import { deleteGalleryImage, deleteMenuItem, deleteTestimonial, getContent, PAGE_KEYS, PageKey, saveBusiness, saveGalleryImage, saveMenuItem, saveSeoSetting, saveTestimonial, uploadPhoto } from "@/lib/content";

async function requireOwner() { if (!await getOwner()) throw new Error("Unauthorized"); }
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const num = (form: FormData, key: string) => Number(form.get(key) || 0);
async function imageValue(form: FormData, field: string, oldField: string) {
  const file = form.get(field);
  if (file instanceof File && file.size > 0) return await uploadPhoto(file);
  return text(form, oldField);
}
function refresh() {
  revalidatePath("/"); revalidatePath("/admin");
  revalidatePath("/menu"); revalidatePath("/story"); revalidatePath("/gallery"); revalidatePath("/contact");
}

export async function logoutAction() { await logoutOwner(); redirect("/admin/login"); }

export async function saveMenuAction(form: FormData) {
  await requireOwner();
  await saveMenuItem(text(form, "id") || null, { name: text(form, "name"), description: text(form, "description"), category: text(form, "category"), price: Math.round(Number(text(form, "price")) * 100), imageUrl: await imageValue(form, "photo", "imageUrl"), imageAlt: text(form, "imageAlt"), featured: form.has("featured"), available: form.has("available"), sortOrder: num(form, "sortOrder") });
  refresh();
}
export async function deleteMenuAction(form: FormData) { await requireOwner(); await deleteMenuItem(text(form, "id")); refresh(); }
export async function saveTestimonialAction(form: FormData) {
  await requireOwner();
  await saveTestimonial(text(form, "id") || null, { name: text(form, "name"), quote: text(form, "quote"), role: text(form, "role"), imageUrl: await imageValue(form, "photo", "imageUrl"), imageAlt: text(form, "imageAlt"), featured: form.has("featured"), sortOrder: num(form, "sortOrder") });
  refresh();
}
export async function deleteTestimonialAction(form: FormData) { await requireOwner(); await deleteTestimonial(text(form, "id")); refresh(); }
export async function saveBusinessAction(form: FormData) {
  await requireOwner();
  const { business } = await getContent();
  await saveBusiness({
    id: "main", name: text(form, "name"), tagline: text(form, "tagline"), story: text(form, "story"), address: text(form, "address"), city: text(form, "city"),
    hoursWeekday: text(form, "hoursWeekday"), hoursWeekend: text(form, "hoursWeekend"), phone: text(form, "phone"), email: text(form, "email"), instagram: text(form, "instagram"), announcement: text(form, "announcement"),
    heroImageUrl: await imageValue(form, "heroPhoto", "heroImageUrl") || business.heroImageUrl, heroImageAlt: text(form, "heroImageAlt"),
    storyImageUrl: await imageValue(form, "storyPhoto", "storyImageUrl") || business.storyImageUrl, storyImageAlt: text(form, "storyImageAlt"),
  });
  refresh();
}

export async function saveSeoAction(form: FormData) {
  await requireOwner();
  const pageKey = text(form, "pageKey") as PageKey;
  if (!PAGE_KEYS.includes(pageKey)) throw new Error("Unknown page.");
  await saveSeoSetting(pageKey, { seoTitle: text(form, "seoTitle").slice(0, 60), metaDescription: text(form, "metaDescription").slice(0, 160), h1: text(form, "h1") });
  refresh();
}

export async function saveGalleryAction(form: FormData) {
  await requireOwner();
  await saveGalleryImage(text(form, "id") || null, { imageUrl: await imageValue(form, "photo", "imageUrl"), altText: text(form, "altText"), sortOrder: num(form, "sortOrder") });
  refresh();
}
export async function deleteGalleryAction(form: FormData) { await requireOwner(); await deleteGalleryImage(text(form, "id")); refresh(); }
