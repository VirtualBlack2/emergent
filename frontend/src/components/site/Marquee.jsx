import { MARQUEE } from "../../lib/data";

const Row = () => (
  <div className="flex shrink-0 items-center">
    {MARQUEE.map((t) => (
      <span key={t} className="font-display flex items-center text-4xl font-bold tracking-tight text-[var(--text)] sm:text-6xl">
        <span className="px-8">{t}</span>
        <span className="text-[var(--accent)]">✦</span>
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="marquee" className="relative overflow-hidden border-y border-white/[0.07] bg-[#0f1513]/60 py-8 backdrop-blur-sm">
    <div className="marquee-track flex w-max">
      <Row /><Row />
    </div>
  </section>
);
