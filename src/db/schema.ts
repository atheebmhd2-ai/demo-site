import { pgTable, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("Coffee"),
  price: integer("price").notNull().default(0),
  imageUrl: text("image_url").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  available: boolean("available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("Local guest"),
  imageUrl: text("image_url").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  featured: boolean("featured").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const businessInfo = pgTable("business_info", {
  id: text("id").primaryKey().default("main"),
  name: text("name").notNull().default("Grind"),
  tagline: text("tagline").notNull().default("Coffee for the moments that matter."),
  story: text("story").notNull().default(""),
  address: text("address").notNull().default(""),
  city: text("city").notNull().default(""),
  hoursWeekday: text("hours_weekday").notNull().default(""),
  hoursWeekend: text("hours_weekend").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  heroImageAlt: text("hero_image_alt").notNull().default(""),
  storyImageUrl: text("story_image_url").notNull().default(""),
  storyImageAlt: text("story_image_alt").notNull().default(""),
  announcement: text("announcement").notNull().default(""),
});

// One SEO row per public page, keyed by a fixed page identifier.
export const seoSettings = pgTable("seo_settings", {
  pageKey: text("page_key").primaryKey(),
  seoTitle: text("seo_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  h1: text("h1").notNull().default(""),
});

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull().default(""),
  altText: text("alt_text").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// A short-lived, single-use CSRF token permits a login form served inside an
// opaque-origin preview sandbox without trusting arbitrary Origin: null posts.
export const loginChallenges = pgTable("login_challenges", {
  tokenHash: text("token_hash").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
