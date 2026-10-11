import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { SiteHeader, MenuSection, Reviews } from "@/components/storefront";
import { ClosingBand, SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getContent();
  const page = seo.home;
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: { title: page.seoTitle, description: page.metaDescription, images: business.heroImageUrl ? [business.heroImageUrl] : undefined },
  };
}

export default async function HomePage() {
  const { menu, testimonials, business, seo } = await getContent();
  const featured = menu.filter(item => item.featured && item.available);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address} ${business.city}`)}`;
  return (
    <main>
      <SiteHeader name={business.name} />
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR NEW FAVORITE CORNER</div>
          <h1>{seo.home.h1}</h1>
          <p className="hero-description">Thoughtfully crafted coffee, genuinely good people, and a place that feels like yours.</p>
          <div className="hero-actions"><a href="/menu" className="button button-dark">Explore our menu <ArrowUpRight size={17} strokeWidth={1.8} /></a><a href="/story" className="text-link">Get to know us <ArrowRight size={17} /></a></div>
          <div className="hero-bottom"><span className="small-star">✳</span><span>GOOD THINGS BREWING DAILY</span><span className="hero-bottom-line" /></div>
        </div>
        <div className="hero-visual" role="img" aria-label={business.heroImageAlt || `${business.name} coffee shop`} style={{ backgroundImage: `linear-gradient(90deg, rgba(14,20,15,.1), rgba(14,20,15,.04)), url("${business.heroImageUrl}")` }}>
          <div className="hero-photo-label"><span className="photo-label-icon">✳</span><span>COME IN, STAY A WHILE<br /><strong>EST. 2024 · NEW YORK</strong></span></div>
          <a href="#menu" className="hero-scroll" aria-label="Scroll to menu preview"><ArrowDown size={20} /></a>
        </div>
      </section>

      <div className="ticker" aria-label="Our values"><div className="ticker-inner"><span>GOOD COFFEE</span><i>✳</i><span>GOOD PEOPLE</span><i>✳</i><span>GOOD DAYS</span><i>✳</i><span>GOOD COFFEE</span><i>✳</i><span>GOOD PEOPLE</span><i>✳</i><span>GOOD DAYS</span><i>✳</i></div></div>

      <section id="menu" className="menu-section section-pad">
        <div className="section-shell">
          <div className="menu-heading"><div><p className="section-kicker"><span>01 /</span> THE GOOD STUFF</p><h2>Made to make<br /><em>your day.</em></h2></div><div className="menu-heading-right"><p>From your first sip to the last crumb, everything here is made with a little extra love.</p><a className="under-link" href="/menu">View full menu <ArrowUpRight size={17} /></a></div></div>
          <MenuSection items={menu} featured={featured} />
        </div>
      </section>

      <section id="story" className="story-section"><div className="story-image" role="img" aria-label={business.storyImageAlt || "Inside the coffee shop"} style={{ backgroundImage: `url("${business.storyImageUrl}")` }}><div className="story-stamp"><span>GRIND</span><span className="stamp-star">✳</span><small>MORE THAN COFFEE</small></div></div><div className="story-copy"><p className="section-kicker"><span>02 /</span> OUR LITTLE STORY</p><h2>More than<br />just a <em>coffee shop.</em></h2><p className="story-lead">A cup of coffee can change the whole day. We&apos;re here for that feeling.</p><p className="story-body">{business.story}</p><a href="/story" className="button button-cream">Read our full story <ArrowUpRight size={17} /></a><div className="story-decoration">GOOD COFFEE, ALWAYS. <span>✳</span></div></div></section>

      <section className="quote-band"><span className="quote-spark">✳</span><p>Made with intention.<br /><em>Served with heart.</em></p><span className="quote-spark">✳</span></section>

      <section id="love" className="reviews-section section-pad"><div className="section-shell reviews-layout"><div className="reviews-intro"><p className="section-kicker"><span>03 /</span> KIND WORDS</p><h2>The people<br />make the <em>place.</em></h2><p>Don&apos;t just take our word for it. Here&apos;s what our little community has to say.</p><div className="review-doodle">“</div></div><Reviews testimonials={testimonials.filter(t => t.featured)} /></div></section>

      <section id="visit" className="visit-section"><div className="visit-photo"><div className="visit-photo-overlay"><span>YOUR SEAT IS WAITING</span><span>↗</span></div></div><div className="visit-copy"><p className="section-kicker"><span>04 /</span> STOP ON BY</p><h2>Come on <em>in.</em></h2><p className="visit-description">Whether you have five minutes or the whole afternoon, there&apos;s always room for you here.</p><div className="visit-detail"><MapPin size={21} strokeWidth={1.5} /><div><strong>FIND US</strong><p>{business.address}<br />{business.city}</p></div></div><div className="visit-detail"><Clock3 size={21} strokeWidth={1.5} /><div><strong>OPEN HOURS</strong><p>{business.hoursWeekday}<br />{business.hoursWeekend}</p></div></div><div className="visit-detail"><Phone size={21} strokeWidth={1.5} /><div><strong>SAY HELLO</strong><p><a href={`tel:${business.phone}`}>{business.phone}</a></p></div></div><a href={mapsUrl} target="_blank" rel="noreferrer" className="button button-dark visit-button">Get directions <ArrowUpRight size={17} /></a></div></section>

      <ClosingBand />
      <SiteFooter business={business} />
    </main>
  );
}
