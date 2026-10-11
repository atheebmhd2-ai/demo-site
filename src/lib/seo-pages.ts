// Client-safe constants shared by the public site and the admin dashboard.
// Keep this file free of server-only imports (database clients, etc.) so it
// can be bundled into Client Components without pulling in Node built-ins.
export const PAGE_KEYS = ["home", "menu", "story", "gallery", "contact"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export const PAGE_LABELS: Record<PageKey, string> = { home: "Home", menu: "Menu", story: "Our story", gallery: "Gallery", contact: "Contact" };
