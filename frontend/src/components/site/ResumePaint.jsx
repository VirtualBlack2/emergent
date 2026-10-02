import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, RotateCcw, ExternalLink } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { LINKS } from "../../lib/data";

const drawCover = (c) => {
  const ctx = c.getContext("2d");
  const { width: w, height: h } = c;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#121a17";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  const g = Math.max(24, w / 18);
  for (let x = 0; x < w; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.textAlign = "center";
  ctx.fillStyle = "#34E39A";
  ctx.font = `600 ${Math.round(w * 0.022)}px "JetBrains Mono", monospace`;
  ctx.fillText("ALIEU BOJANG — RESUME", w / 2, h * 0.44);
  ctx.fillStyle = "#EEF3F0";
  ctx.font = `800 ${Math.round(w * 0.1)}px Syne, sans-serif`;
  ctx.fillText("PAINT IT", w / 2, h * 0.53);
  ctx.fillText("FULL.", w / 2, h * 0.53 + w * 0.1);
  ctx.fillStyle = "#A3B3AB";
  ctx.font = `500 ${Math.round(w * 0.026)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("Move or drag across to reveal", w / 2, h * 0.53 + w * 0.18);
};

export const ResumePaint = () => {
  const wrap = useRef(null), cv = useRef(null), last = useRef(null), strokes = useRef(0);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  const setup = useCallback(() => {
    const c = cv.current, el = wrap.current;
    if (!c || !el) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(el.clientWidth * dpr);
    c.height = Math.floor(el.clientHeight * dpr);
    drawCover(c);
    last.current = null;
    setPct(0);
  }, []);

  useEffect(() => {
    let w = window.innerWidth;
    const t = setTimeout(setup, 50);
    const on = () => { if (Math.abs(window.innerWidth - w) > 40) { w = window.innerWidth; if (!done) setup(); } };
    window.addEventListener("resize", on);
    if (document.fonts) document.fonts.ready.then(() => { if (!done) setup(); });
    return () => { clearTimeout(t); window.removeEventListener("resize", on); };
  }, [setup, done]);

  const measure = () => {
    const c = cv.current;
    const data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let clear = 0, n = 0;
    for (let i = 3; i < data.length; i += 4 * 97) { n++; if (data[i] < 40) clear++; }
    const p = Math.round((clear / n) * 100);
    setPct(p);
    if (p >= 55) setDone(true);
  };

  const paint = (e) => {
    if (done) return;
    if (e.pointerType !== "mouse" && e.buttons === 0 && e.type !== "pointerdown") return;
    const c = cv.current, r = c.getBoundingClientRect();
    const k = c.width / r.width;
    const x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
    const ctx = c.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    const rad = Math.max(40, c.width * 0.07);
    const from = last.current || { x, y };
    const dist = Math.hypot(x - from.x, y - from.y);
    const steps = Math.max(1, Math.ceil(dist / (rad * 0.25)));
    for (let i = 0; i <= steps; i++) {
      const px = from.x + ((x - from.x) * i) / steps, py = from.y + ((y - from.y) * i) / steps;
      const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
      g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.55, "rgba(0,0,0,0.85)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
    }
    last.current = { x, y };
    if (++strokes.current % 12 === 0) measure();
  };

  const reset = () => { setDone(false); requestAnimationFrame(setup); };

  return (
    <section id="resume" data-testid="resume-section" className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead index="04" eyebrow="Resume" title={<>Paint it<br />full.</>} testid="resume-heading" />
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="max-w-sm text-base leading-relaxed text-[var(--muted)]">
              My resume is hidden under a layer of wet ink. Sweep your cursor (or finger) across it to wipe it clean — or skip straight to the good part.
            </p>
            <div className="mt-8">
              <div className="flex items-center justify-between font-mono-x text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                <span>Revealed</span><span data-testid="resume-progress" className="text-[var(--accent)]">{done ? 100 : pct}%</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full bg-[var(--accent)]" animate={{ width: `${done ? 100 : pct}%` }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }} />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a data-testid="resume-download-btn" href={LINKS.resume} download="Alieu_Bojang_Resume.pdf" className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#06120c] transition-transform duration-300 hover:scale-[1.03]">
                <Download className="h-4 w-4" /> Download PDF
              </a>
              {done ? (
                <button data-testid="resume-reset-btn" onClick={reset} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-[var(--text)] transition-colors duration-300 hover:border-[var(--accent)]">
                  <RotateCcw className="h-4 w-4" /> Repaint
                </button>
              ) : (
                <button data-testid="resume-reveal-btn" onClick={() => setDone(true)} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-[var(--text)] transition-colors duration-300 hover:border-[var(--accent)]">
                  <Eye className="h-4 w-4" /> Reveal all
                </button>
              )}
              <a data-testid="resume-open-btn" href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full px-3 py-3 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]">
                Open <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div ref={wrap} data-testid="resume-paint-frame" className="relative mx-auto aspect-[1445/1870] w-full max-w-[760px] overflow-hidden rounded-[22px] border border-white/10 bg-white shadow-[0_50px_140px_-40px_rgba(52,227,154,0.35)]">
              <img src="/assets/resume-0.webp" alt="Alieu Bojang resume" className="absolute inset-0 h-full w-full object-cover" />
              <motion.canvas
                ref={cv}
                data-testid="resume-paint-canvas"
                onPointerMove={paint}
                onPointerDown={paint}
                onPointerLeave={() => { last.current = null; }}
                onPointerUp={() => { last.current = null; measure(); }}
                animate={{ opacity: done ? 0 : 1, scale: done ? 1.04 : 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute inset-0 h-full w-full cursor-crosshair touch-pan-y ${done ? "pointer-events-none" : ""}`}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
