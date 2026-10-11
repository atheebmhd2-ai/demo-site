import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/storefront";
import { ClosingBand, SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getContent();
  const page = seo.gallery;
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: { title: page.seoTitle, description: page.metaDescription },
  };
}

export default async function GalleryPage() {
  const { gallery, business, seo } = await getContent();
  return (
    <main>
      <SiteHeader name={business.name} />
      <section className="page-banner"><p className="section-kicker"><span>✳</span> A LITTLE LOOK AROUND</p><h1>{seo.gallery.h1}</h1><p>A few favorite moments from behind the counter and around the shop.</p></section>
      {gallery.length ? (
        <div className="gallery-grid">
          {gallery.map(photo => <div className="gallery-item" key={photo.id}><img src={photo.imageUrl} alt={photo.altText || business.name} loading="lazy" /></div>)}
        </div>
      ) : <p className="gallery-empty">More photos are brewing. Check back soon.</p>}
      <ClosingBand />
      <SiteFooter business={business} />
    </main>
  );
}
