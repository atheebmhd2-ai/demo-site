"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";
import type { MenuItem, Testimonial } from "@/lib/content";

export function SiteHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const links = [{ label: "Menu", href: "/menu" }, { label: "Our story", href: "/story" }, { label: "Gallery", href: "/gallery" }, { label: "The love", href: "/#love" }, { label: "Visit us", href: "/contact" }];
  return <header id="top" className="site-header"><a href="/#top" className="brand" onClick={() => setOpen(false)}>{name.toLowerCase()}<span>✳</span></a><nav className={open ? "header-nav open" : "header-nav"} aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</nav><a href="/contact" className="header-cta">Come say hello <ArrowUpRight size={16} /></a><button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={25} /> : <MenuIcon size={25} />}</button></header>;
}

export function MenuSection({ items, featured }: { items: MenuItem[]; featured: MenuItem[] }) {
  const [active, setActive] = useState("Favorites");
  const categories = ["Favorites", ...Array.from(new Set(items.filter(i => i.available).map(i => i.category)))];
  const shown = (active === "Favorites" ? featured : items.filter(i => i.category === active && i.available)).slice(0, 4);
  return <><div className="menu-tabs" role="tablist" aria-label="Menu category">{categories.map(category => <button key={category} role="tab" aria-selected={active === category} className={active === category ? "active" : ""} onClick={() => setActive(category)}>{category}</button>)}</div><div className="menu-grid">{shown.length ? shown.map((item, index) => <article className="menu-card" key={item.id}><div className="menu-card-image" style={{ backgroundImage: `url("${item.imageUrl}")` }}><span className="menu-card-number">0{index + 1}</span></div><div className="menu-card-meta"><span>{item.category.toUpperCase()}</span><span>✳</span></div><div className="menu-card-title"><h3>{item.name}</h3><strong>${(item.price / 100).toFixed(2)}</strong></div><p>{item.description}</p></article>) : <p className="menu-empty">More good things are coming soon.</p>}</div><div className="menu-footnote"><span>✳</span> MADE FRESH, MADE WITH LOVE, MADE FOR YOU <span>✳</span></div></>;
}

export function Reviews({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (!testimonials.length) return <div className="review-card">Good words are brewing. Come back soon!</div>;
  const current = testimonials[index % testimonials.length];
  return <div className="review-card"><div className="review-top"><span className="review-stars">★★★★★</span><span className="review-count">0{index + 1} / 0{testimonials.length}</span></div><span className="review-quote-icon">“</span><blockquote>{current.quote}</blockquote><div className="review-bottom"><div className="review-person"><div className="review-avatar">{current.imageUrl ? <img src={current.imageUrl} alt={current.name} /> : current.name.charAt(0)}</div><div><strong>{current.name}</strong><span>{current.role}</span></div></div><div className="review-arrows"><button aria-label="Previous review" onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}><ArrowLeft size={19} /></button><button aria-label="Next review" onClick={() => setIndex((index + 1) % testimonials.length)}><ArrowRight size={19} /></button></div></div></div>;
}
