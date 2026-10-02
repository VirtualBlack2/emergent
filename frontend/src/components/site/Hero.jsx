import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowDownRight, FileText } from "lucide-react";
import { scrollToId } from "./Nav";

const EASE = [0.16, 1, 0.3, 1];
const Line = ({ children, delay, className = "" }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span className={`block ${className}`} initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, delay, ease: EASE }}>
      {children}
    </motion.span>
  </span>
);

const TiltStack = () => {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <motion.div
      data-testid="hero-tilt-stack"
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.7, ease: EASE }}
      className="relative mx-auto aspect-[4/5] w-full max-w-[420px] [perspective:1200px]"
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative h-full w-full">
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#111815] shadow-[0_40px_120px_-30px_rgba(52,227,154,0.35)]">
          <img src="/assets/zerohour.webp" alt="Zero Hour artwork" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="font-mono-x text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">Now deploying</p>
              <p className="font-display text-2xl font-bold text-white">Zero Hour</p>
            </div>
            <span className="font-mono-x rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] text-white/90 backdrop-blur">1939 · FPS</span>
          </div>
        </div>
        <div style={{ transform: "translateZ(80px)" }} className="absolute -left-6 top-10 h-24 w-24 overflow-hidden rounded-2xl border border-white/15 shadow-2xl sm:-left-10 sm:h-28 sm:w-28">
          <img src="/assets/recoil.webp" alt="Recoil Bot icon" className="h-full w-full object-cover" />
        </div>
        <div style={{ transform: "translateZ(120px)" }} className="absolute -right-4 top-1/2 h-16 w-16 overflow-hidden rounded-2xl border border-white/15 shadow-2xl sm:-right-8 sm:h-20 sm:w-20">
          <img src="/assets/stealth.png" alt="StealthGPT icon" className="h-full w-full object-cover" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 140]);
  return (
    <section id="top" data-testid="hero-section" className="relative flex min-h-[100svh] items-center px-5 pb-16 pt-32 sm:px-8">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-12">
        <motion.div style={{ y }} className="lg:col-span-7">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="font-mono-x mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" /></span>
            CS @ Bridgewater State · Class of 2027
          </motion.p>
          <h1 data-testid="hero-title" className="font-display text-[15vw] font-extrabold leading-[0.86] tracking-[-0.04em] text-[var(--text)] sm:text-[11vw] lg:text-[8.2rem]">
            <Line delay={0.35}>Alieu</Line>
            <Line delay={0.5}>Bojang<span className="text-[var(--accent)]">.</span></Line>
          </h1>
          <div className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
            <Line delay={0.8}>I build <em className="font-serif-x not-italic text-[var(--text)]">games</em>, <em className="font-serif-x not-italic text-[var(--text)]">bots</em> &amp;</Line>
            <Line delay={0.92}><em className="font-serif-x not-italic text-[var(--text)]">AI workflows</em> — from a 10M+ play</Line>
            <Line delay={1.04}>Roblox game to automations.</Line>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.9, ease: EASE }} className="mt-10 flex flex-wrap gap-3">
            <button data-testid="hero-cta-projects" onClick={() => scrollToId("projects")} className="group flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[#06120c] transition-transform duration-300 hover:scale-[1.03]">
              See the work <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </button>
            <button data-testid="hero-cta-resume" onClick={() => scrollToId("resume")} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-[var(--text)] backdrop-blur transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <FileText className="h-4 w-4" /> Paint my resume
            </button>
          </motion.div>
        </motion.div>
        <div className="lg:col-span-5">
          <TiltStack />
        </div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="font-mono-x pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-[var(--muted)] md:block">
        Move your cursor
      </motion.p>
    </section>
  );
};
