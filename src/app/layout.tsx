import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grind Coffee | Good coffee. Better moments.",
  description: "Thoughtfully crafted coffee, genuinely good people, and a place that feels like yours. Visit Grind Coffee in New York.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
