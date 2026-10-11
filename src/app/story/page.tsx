import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/storefront";
import { ClosingBand, SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getContent();
  const page = seo.story;
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: { title: page.seoTitle, description: page.metaDescription, images: business.storyImageUrl ? [business.storyImageUrl] : undefined },
  };
}

export default async function StoryPage() {
  const { business, seo } = await getContent();
  return (
    <main>
      <SiteHeader name={business.name} />
      <section className="page-banner"><p className="section-kicker"><span>✳</span> HOW IT ALL STARTED</p><h1>{seo.story.h1}</h1><p>{business.tagline}</p></section>
      <section className="story-section" style={{ minHeight: "auto" }}>
        <div className="story-image" role="img" aria-label={business.storyImageAlt || `Inside ${business.name}`} style={{ backgroundImage: `url("${business.storyImageUrl}")` }}>
          <div className="story-stamp"><span>GRIND</span><span className="stamp-star">✳</span><small>MORE THAN COFFEE</small></div>
        </div>
        <div className="story-copy">
          <p className="section-kicker"><span>✳</span> OUR LITTLE STORY</p>
          <h2>More than<br />just a <em>coffee shop.</em></h2>
          <p className="story-lead">A cup of coffee can change the whole day. We&apos;re here for that feeling.</p>
          <p className="story-body">{business.story}</p>
          <a href="/contact" className="button button-cream">Find your way here <ArrowUpRight size={17} /></a>
          <div className="story-decoration">GOOD COFFEE, ALWAYS. <span>✳</span></div>
        </div>
      </section>
      <ClosingBand />
      <SiteFooter business={business} />
    </main>
  );
}
