import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Logo } from "./Logo";

export const Footer = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <footer data-testid="footer" className="relative overflow-hidden px-5 pb-10 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-display select-none text-[22vw] font-extrabold leading-[0.8] tracking-[-0.05em] text-white/[0.06] lg:text-[16rem]">VIRTUAL</p>
        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} Alieu Bojang</span>
          </div>
          <span className="font-mono-x text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Massachusetts · {time} ET</span>
          <button data-testid="back-to-top-btn" onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo(0, 0))}
            className="flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--text)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] sm:self-auto">
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
