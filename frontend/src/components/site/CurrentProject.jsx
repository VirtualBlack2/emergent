import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Globe2, Map, Stamp, RotateCcw } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

const FLAGS = [
  ["France", "v", ["#0055A4", "#FFFFFF", "#EF4135"]], ["Germany", "h", ["#000000", "#DD0000", "#FFCE00"]],
  ["Italy", "v", ["#009246", "#FFFFFF", "#CE2B37"]], ["Japan", "c", ["#FFFFFF", "#BC002D"]],
  ["Nigeria", "v", ["#008751", "#FFFFFF", "#008751"]], ["Ukraine", "h", ["#0057B7", "#FFD700"]],
  ["Ireland", "v", ["#169B62", "#FFFFFF", "#FF883E"]], ["Netherlands", "h", ["#AE1C28", "#FFFFFF", "#21468B"]],
  ["Bangladesh", "c", ["#006A4E", "#F42A41"]], ["Belgium", "v", ["#000000", "#FDDA24", "#EF3340"]],
  ["Austria", "h", ["#ED2939", "#FFFFFF", "#ED2939"]], ["Mali", "v", ["#14B53A", "#FCD116", "#CE1126"]],
  ["Hungary", "h", ["#CD2A3E", "#FFFFFF", "#436F4D"]], ["Romania", "v", ["#002B7F", "#FCD116", "#CE1126"]],
  ["Estonia", "h", ["#0072CE", "#000000", "#FFFFFF"]], ["Peru", "v", ["#D91023", "#FFFFFF", "#D91023"]],
  ["Lithuania", "h", ["#FDB913", "#006A44", "#C1272D"]], ["Guinea", "v", ["#CE1126", "#FCD116", "#009460"]],
  ["Poland", "h", ["#FFFFFF", "#DC143C"]], ["Chad", "v", ["#002664", "#FECB00", "#C60C30"]],
  ["Bulgaria", "h", ["#FFFFFF", "#00966E", "#D62612"]], ["Palau", "c", ["#4AADD6", "#FFDE00"]],
  ["Russia", "h", ["#FFFFFF", "#0039A6", "#D52B1E"]], ["Ivory Coast", "v", ["#F77F00", "#FFFFFF", "#009E60"]],
];

const Flag = ({ dir, colors }) => {
  if (dir === "c") {
    return <div className="relative h-full w-full" style={{ background: colors[0] }}><span className="absolute left-1/2 top-1/2 h-[45%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: colors[1] }} /></div>;
  }
  return <div className={`flex h-full w-full ${dir === "v" ? "flex-row" : "flex-col"}`}>{colors.map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}</div>;
};

const FEATURES = [
  [Globe2, "World Discovery mode", "Start your journey and travel across the map."],
  [Map, "Unlock countries", "Paint each flag to open up new places."],
  [Coins, "Earn Coins", "Get rewarded for how well you know the world."],
  [Stamp, "Passport Stamps", "Collect a stamp for every country you color."],
];

export const CurrentProject = () => {
  const [painted, setPainted] = useState(() => new Set());
  const paint = (name) => setPainted((s) => (s.has(name) ? s : new Set(s).add(name)));
  return (
    <section id="now" data-testid="current-project-section" className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead index="02" eyebrow="Currently building" title={<>Color the<br />World.</>} testid="current-project-heading" />
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div data-testid="colortheworld-cover" className="group relative overflow-hidden rounded-[28px] border border-white/10 shadow-[0_50px_120px_-40px_rgba(52,227,154,0.45)]">
              <img src="/assets/colortheworld.webp" alt="Color the World cover art" className="aspect-square w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <span className="font-mono-x inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" /> In development · Roblox
            </span>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text)]">Travel across the map, paint country flags, and test how well you know the world — a 3D flag-drawing adventure where your world map slowly fills with color.</p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {FEATURES.map(([Icon, t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"><Icon className="h-5 w-5 text-[var(--accent)]" /></span>
                  <span><span className="block font-semibold text-[var(--text)]">{t}</span><span className="text-sm text-[var(--muted)]">{d}</span></span>
                </li>
              ))}
            </ul>
            <div data-testid="flag-board" className="mt-10 rounded-[28px] border border-white/[0.08] bg-[#111816]/80 p-5 backdrop-blur-md sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-mono-x text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Hover to paint · <span data-testid="flag-count" className="text-[var(--accent)]">{painted.size}/{FLAGS.length}</span> colored</p>
                <button data-testid="flag-reset-btn" onClick={() => setPainted(new Set())} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-[var(--text)] transition-colors hover:border-[var(--accent)]"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
              </div>
              <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3">
                {FLAGS.map(([name, dir, colors]) => {
                  const on = painted.has(name);
                  return (
                    <motion.button
                      key={name}
                      data-testid={`flag-${name.toLowerCase().replace(/\s/g, "-")}`}
                      title={name}
                      onPointerEnter={() => paint(name)}
                      onClick={() => paint(name)}
                      whileHover={{ y: -3, rotate: -2 }}
                      className="relative aspect-[3/2] overflow-hidden rounded-md border border-white/10"
                    >
                      <div className={`h-full w-full transition-[filter,opacity] duration-700 ${on ? "opacity-100 grayscale-0" : "opacity-40 grayscale"}`}><Flag dir={dir} colors={colors} /></div>
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full bg-[var(--accent)]" animate={{ width: `${(painted.size / FLAGS.length) * 100}%` }} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
