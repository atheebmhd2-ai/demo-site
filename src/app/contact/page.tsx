import type { Metadata } from "next";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/storefront";
import { ClosingBand, SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getContent();
  const page = seo.contact;
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: { title: page.seoTitle, description: page.metaDescription },
  };
}

export default async function ContactPage() {
  const { business, seo } = await getContent();
  const query = encodeURIComponent(`${business.address} ${business.city}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${query}&output=embed`;
  return (
    <main>
      <SiteHeader name={business.name} />
      <section className="page-banner"><p className="section-kicker"><span>✳</span> WE&apos;D LOVE TO SEE YOU</p><h1>{seo.contact.h1}</h1><p>Whether you have five minutes or the whole afternoon, there&apos;s always room for you here.</p></section>
      <section className="visit-section" style={{ minHeight: "auto" }}>
        <div className="visit-photo"><div className="visit-photo-overlay"><span>YOUR SEAT IS WAITING</span><span>↗</span></div></div>
        <div className="visit-copy">
          <div className="visit-detail"><MapPin size={21} strokeWidth={1.5} /><div><strong>FIND US</strong><p>{business.address}<br />{business.city}</p></div></div>
          <div className="visit-detail"><Clock3 size={21} strokeWidth={1.5} /><div><strong>OPEN HOURS</strong><p>{business.hoursWeekday}<br />{business.hoursWeekend}</p></div></div>
          <div className="visit-detail"><Phone size={21} strokeWidth={1.5} /><div><strong>SAY HELLO</strong><p><a href={`tel:${business.phone}`}>{business.phone}</a><br /><a href={`mailto:${business.email}`}>{business.email}</a></p></div></div>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="button button-dark visit-button">Get directions <ArrowUpRight size={17} /></a>
          <iframe className="contact-map" src={mapEmbedUrl} loading="lazy" title={`Map to ${business.name}`} />
        </div>
      </section>
      <ClosingBand />
      <SiteFooter business={business} />
    </main>
  );
}
