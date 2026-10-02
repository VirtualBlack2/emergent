import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const MessageReceived = ({ name, onReset }) => (
  <motion.div
    data-testid="contact-success"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: EASE }}
    className="relative flex min-h-[380px] flex-col items-start justify-center overflow-hidden rounded-[28px] border border-[var(--accent)]/30 bg-[#111816]/80 p-8 backdrop-blur-md sm:p-10"
  >
    <motion.span
      aria-hidden="true"
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 6, opacity: 0 }}
      transition={{ duration: 1.6, ease: EASE }}
      className="pointer-events-none absolute left-14 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[var(--accent)]"
    />
    <svg viewBox="0 0 52 52" className="relative h-16 w-16">
      <motion.circle cx="26" cy="26" r="24" fill="none" stroke="var(--accent)" strokeWidth="2.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE }} />
      <motion.path d="M15 27 l7 7 l15 -16" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6, ease: EASE }} />
    </svg>
    <p className="font-mono-x relative mt-8 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Transmission received</p>
    <span className="relative block overflow-hidden pb-[0.08em]">
      <motion.h3 data-testid="contact-success-title" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.3, ease: EASE }}
        className="font-display mt-3 text-4xl font-bold leading-[0.95] tracking-tight text-[var(--text)] sm:text-5xl">
        Thanks, {name}.
      </motion.h3>
    </span>
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
      className="relative mt-4 max-w-md text-base leading-relaxed text-[var(--muted)]">
      Your message landed in my inbox. I usually reply within a couple of days — keep an eye on your email.
    </motion.p>
    <motion.button data-testid="contact-send-another-btn" onClick={onReset} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
      className="relative mt-8 flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-[var(--text)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]">
      <RotateCcw className="h-4 w-4" /> Send another
    </motion.button>
  </motion.div>
);
