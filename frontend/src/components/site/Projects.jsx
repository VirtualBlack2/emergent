import { ArrowUpRight, Github, Gamepad2, MapPin } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { LINKS } from "../../lib/data";

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const Card = ({ testid, className = "", children, delay = 0 }) => (
  <Reveal delay={delay} className={className}>
    <div data-testid={testid} onMouseMove={spot} className="bento-card group relative h-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111816]/80 backdrop-blur-md">
      {children}
    </div>
  </Reveal>
);

const Tags = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((t) => <span key={t} className="font-mono-x rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-[var(--muted)]">{t}</span>)}
  </div>
);

const ZeroHour = () => (
  <Card testid="project-card-zerohour" className="md:col-span-7 md:row-span-2">
    <div className="relative h-72 overflow-hidden sm:h-96 md:h-[62%]">
      <img src="/assets/zerohour.webp" alt="Zero Hour gameplay art" className="h-full w-full object-cover object-[50%_30%] transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111816] via-[#111816]/10 to-transparent" />
      <span className="font-mono-x absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/90 backdrop-blur">Roblox · FPS</span>
    </div>
    <div className="flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">Zero Hour</h3>
        <a data-testid="zerohour-play-link" href={LINKS.zerohour} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#06120c] transition-transform duration-300 hover:scale-105">
          <Gamepad2 className="h-4 w-4" /> Play
        </a>
      </div>
      <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
        Step into 1939 and experience intense, historically inspired first-person combat. Fight as the Allies or Axis, deploy alongside your squad, and battle for control of war-torn objectives.
      </p>
      <Tags items={["Roblox Studio", "Lua", "Allies vs Axis", "Squad combat"]} />
    </div>
  </Card>
);

const Recoil = () => (
  <Card testid="project-card-recoilbot" className="md:col-span-5" delay={0.08}>
    <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <img src="/assets/recoil.webp" alt="Recoil Bot icon" className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-[0_20px_50px_-15px_rgba(220,38,38,0.6)] transition-transform duration-500 group-hover:-rotate-6 sm:h-28 sm:w-28" />
        <span className="font-mono-x text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">Discord bot</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--text)]">Recoil Bot</h3>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          A multipurpose Discord bot for ZERO HOUR. Pulls in-game player data and records via commands, answers mentions and /question with an editable knowledge base plus Gemini, and runs private support, report &amp; suggestion tickets with claim and conclusion controls.
        </p>
        <Tags items={["Discord", "Gemini API", "Ticketing"]} />
      </div>
    </div>
  </Card>
);

const Stealth = () => (
  <Card testid="project-card-stealthgpt" className="md:col-span-5" delay={0.16}>
    <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <img src="/assets/stealth.png" alt="StealthGPT icon" className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-[0_20px_50px_-15px_rgba(37,99,235,0.7)] transition-transform duration-500 group-hover:rotate-6 sm:h-28 sm:w-28" />
        <span className="font-mono-x text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">Productivity tool</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--text)]">StealthGPT</h3>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Stay focused and distraction-free. One toggle or hotkey disguises your active AI chat as a calm, realistic workspace — a document, inbox, or calendar.
        </p>
        <Tags items={["Hotkey toggle", "Disguise modes", "Focus"]} />
      </div>
    </div>
  </Card>
);

const Small = ({ testid, delay, icon: Icon, kicker, title, body, href, className = "md:col-span-4" }) => (
  <Card testid={testid} className={className} delay={delay}>
    <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-mono-x text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">{kicker}</span>
        {Icon && <Icon className="h-5 w-5 text-[var(--muted)]" />}
      </div>
      <div>
        <h3 className="font-display text-3xl font-bold tracking-tight text-[var(--text)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
        {href && (
          <a data-testid={`${testid}-link`} href={href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)]">
            Open <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  </Card>
);

const TypingSurvival = () => (
  <Card testid="project-card-typingsurvival" className="md:col-span-7">
    <div className="flex h-full flex-col sm:flex-row">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
        <img src="/assets/typingsurvival.webp" alt="Typing Survival cover art" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
      <span className="font-mono-x text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">Roblox · Word game</span>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-3xl font-bold tracking-tight text-[var(--text)]">Typing Survival</h3>
          <a data-testid="typingsurvival-play-link" href={LINKS.typingsurvival} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#06120c] transition-transform duration-300 hover:scale-105">
            <Gamepad2 className="h-4 w-4" /> Play
          </a>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-[var(--muted)]">A fast-paced typing game on Roblox, inspired by Glyphica — type to stay alive.</p>
        <Tags items={["Roblox Studio", "Lua", "Inspired by Glyphica"]} />
      </div>
      </div>
    </div>
  </Card>
);

export const Projects = () => (
  <section id="projects" data-testid="projects-section" className="relative px-5 py-24 sm:px-8 md:py-36">
    <div className="mx-auto max-w-7xl">
      <SectionHead index="01" eyebrow="Selected work" title={<>Things I've<br />shipped.</>} testid="projects-heading" />
      <div className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(300px,auto)] md:grid-cols-12 md:gap-5">
        <ZeroHour />
        <Recoil />
        <Stealth />
        <TypingSurvival />
        <Small testid="card-roblox-stat" delay={0.08} className="md:col-span-5" kicker="Roblox dev" title="10M+ plays" body="Interactive Roblox experiences with gameplay systems, interfaces, progression and leaderboards — one surpassed 10 million plays." icon={Gamepad2} />
        <Small testid="card-lightnata" delay={0} className="md:col-span-6" kicker="Flutter · Firebase · Maps" title="Lightnata" body="A power-outage reporting prototype: location-based reports and community status on an interactive map, with clustering and admin announcements." icon={MapPin} />
        <Small testid="card-github" delay={0.08} className="md:col-span-6" kicker="Open source" title="GitHub" body="Code, experiments and bots — follow along as VirtualBlack2." icon={Github} href={LINKS.github} />
      </div>
    </div>
  </section>
);
