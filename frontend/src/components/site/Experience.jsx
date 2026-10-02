import { Reveal, SectionHead } from "./Reveal";
import { EXPERIENCE, SKILLS } from "../../lib/data";

export const Experience = () => (
  <section id="experience" data-testid="experience-section" className="relative px-5 py-24 sm:px-8 md:py-36">
    <div className="mx-auto max-w-7xl">
      <SectionHead index="03" eyebrow="Experience" title={<>Where I've<br />put in the hours.</>} testid="experience-heading" />
      <div className="grid gap-16 lg:grid-cols-12">
        <ol className="lg:col-span-8">
          {EXPERIENCE.map((x, i) => (
            <Reveal key={x.org} delay={i * 0.06}>
              <li data-testid={`experience-item-${i}`} className="group grid gap-4 border-t border-white/10 py-10 transition-colors duration-500 sm:grid-cols-[180px_1fr]">
                <p className="font-mono-x text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{x.time}</p>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-3xl">{x.org}</h3>
                  <p className="mt-1 text-sm text-[var(--text)]/80">{x.role} · <span className="text-[var(--muted)]">{x.place}</span></p>
                  <ul className="mt-5 space-y-3">
                    {x.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                        <span className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-[var(--accent)]" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <div data-testid="skills-panel" className="rounded-[28px] border border-white/[0.08] bg-[#111816]/80 p-7 backdrop-blur-md">
              <p className="font-mono-x text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Toolkit</p>
              {SKILLS.map((s) => (
                <div key={s.group} className="mt-7">
                  <p className="text-sm font-semibold text-[var(--text)]">{s.group}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.items.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--muted)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--text)]">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
