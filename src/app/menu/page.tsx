import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/storefront";
import { ClosingBand, SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getContent();
  const page = seo.menu;
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: { title: page.seoTitle, description: page.metaDescription, images: business.heroImageUrl ? [business.heroImageUrl] : undefined },
  };
}

export default async function MenuPage() {
  const { menu, business, seo } = await getContent();
  const available = menu.filter(item => item.available);
  const categories = Array.from(new Set(available.map(item => item.category)));
  return (
    <main>
      <SiteHeader name={business.name} />
      <section className="page-banner"><p className="section-kicker"><span>✳</span> THE FULL LINE-UP</p><h1>{seo.menu.h1}</h1><p>Every coffee, bite, and seasonal favorite we&apos;re currently pouring and baking.</p></section>
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="section-shell">
          {categories.length ? categories.map(category => (
            <div className="full-menu-category" key={category}>
              <h2>{category}</h2>
              <div className="menu-grid">
                {available.filter(item => item.category === category).map((item, index) => (
                  <article className="menu-card" key={item.id}>
                    <div className="menu-card-image" role="img" aria-label={item.imageAlt || item.name} style={{ backgroundImage: `url("${item.imageUrl}")` }}><span className="menu-card-number">0{index + 1}</span></div>
                    <div className="menu-card-meta"><span>{item.category.toUpperCase()}</span><span>✳</span></div>
                    <div className="menu-card-title"><h3>{item.name}</h3><strong>${(item.price / 100).toFixed(2)}</strong></div>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          )) : <p className="menu-empty">More good things are coming soon.</p>}
        </div>
      </section>
      <ClosingBand />
      <SiteFooter business={business} />
    </main>
  );
}
