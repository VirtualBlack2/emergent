import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 28, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ index, eyebrow, title, testid }) => (
  <Reveal className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="font-mono-x text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{index} — {eyebrow}</p>
      <h2 data-testid={testid} className="font-display mt-4 text-4xl font-bold leading-[0.95] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  </Reveal>
);
