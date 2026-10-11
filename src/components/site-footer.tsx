import { ArrowUpRight, Sparkles } from "lucide-react";
import type { BusinessInfo } from "@/lib/content";

export function ClosingBand() {
  return <section className="closing-section"><span className="closing-star">✳</span><p>See you soon,</p><h2>coffee lover.</h2><a href="/#top" className="closing-top">BACK TO TOP ↑</a></section>;
}

export function SiteFooter({ business }: { business: BusinessInfo }) {
  return <footer className="footer">
    <div className="footer-main">
      <div><a className="footer-logo" href="/#top">{business.name.toLowerCase()}<span>✳</span></a><p>Good coffee. Better moments.<br />Made for the everyday.</p></div>
      <div className="footer-links">
        <div><strong>EXPLORE</strong><a href="/menu">The menu</a><a href="/story">Our story</a><a href="/gallery">Gallery</a><a href="/#love">Kind words</a><a href="/contact">Visit us</a></div>
        <div><strong>LET&apos;S TALK</strong><a href={`mailto:${business.email}`}>{business.email}</a><a href={`tel:${business.phone}`}>{business.phone}</a><a href={business.instagram} target="_blank" rel="noreferrer" className="social-link">Instagram <ArrowUpRight size={15} /></a></div>
      </div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} GRIND COFFEE. ALL GOOD THINGS RESERVED.</span><span>BREWED WITH LOVE IN NEW YORK <Sparkles size={13} /></span><a href="/admin">OWNER LOGIN</a></div>
  </footer>;
}
