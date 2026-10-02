import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

const ITEMS = [["projects", "Work"], ["now", "Now"], ["experience", "Experience"], ["resume", "Resume"], ["contact", "Contact"]];

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const Nav = () => {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8"
    >
      <nav className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 transition-[background-color,border-color] duration-500 ${solid ? "border-white/10 bg-[#0d1311]/70 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <button data-testid="nav-logo" onClick={() => window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo(0, 0)} className="flex items-center gap-3 rounded-full pr-2">
          <Logo />
          <span className="font-display hidden text-sm font-bold tracking-tight text-[var(--text)] sm:block">VIRTUAL<span className="text-[var(--accent)]">/</span>BLACK</span>
        </button>
        <div className="flex items-center gap-1">
          {ITEMS.map(([id, label]) => (
            <button key={id} data-testid={`nav-link-${id}`} onClick={() => scrollToId(id)} className="nav-link hidden rounded-full px-4 py-2 text-sm text-[var(--muted)] transition-colors duration-300 hover:text-[var(--text)] md:block">
              {label}
            </button>
          ))}
          <button data-testid="nav-cta-contact" onClick={() => scrollToId("contact")} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#06120c] transition-transform duration-300 hover:scale-[1.04]">
            Let's talk
          </button>
        </div>
      </nav>
    </motion.header>
  );
};
