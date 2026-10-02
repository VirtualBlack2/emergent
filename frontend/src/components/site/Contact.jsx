import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Copy, Github, Mail, MessageCircle, Send } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { LINKS } from "../../lib/data";
import { MessageReceived } from "./MessageReceived";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : null;
const USE_NETLIFY = process.env.REACT_APP_FORM_PROVIDER === "netlify" || !API;

const sendNetlify = async (form) => {
  const body = new URLSearchParams({ "form-name": "contact", ...form }).toString();
  const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!res.ok) throw new Error("netlify");
};
const field = "w-full rounded-2xl border border-white/10 bg-[#0d1311]/80 px-5 py-4 text-[15px] text-[var(--text)] placeholder:text-[#8a9a92] outline-none transition-[border-color,box-shadow] duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(52,227,154,0.12)]";

const ContactLink = ({ testid, icon: Icon, label, value, href, onClick }) => {
  const Tag = href ? "a" : "button";
  return (
    <Tag data-testid={testid} href={href} onClick={onClick} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
      className="group flex w-full items-center justify-between gap-4 border-t border-white/10 py-5 text-left transition-colors duration-300 hover:text-[var(--accent)]">
      <span className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-[var(--accent)]" />
        <span>
          <span className="font-mono-x block text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">{label}</span>
          <span className="font-display text-lg font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)] sm:text-xl">{value}</span>
        </span>
      </span>
      {onClick ? <Copy className="h-4 w-4 text-[var(--muted)]" /> : <ArrowUpRight className="h-5 w-5 text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />}
    </Tag>
  );
};

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sentName, setSentName] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSending(true);
    try {
      if (USE_NETLIFY) await sendNetlify(form);
      else await axios.post(`${API}/contact`, form);
      const r = formEl?.getBoundingClientRect();
      if (r) {
        const pts = [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom], [r.left + r.width / 2, r.top], [r.left + r.width / 2, r.bottom]];
        pts.forEach(([px, py], i) => setTimeout(() => window.dispatchEvent(new CustomEvent("fluid-burst", { detail: { x: px / window.innerWidth, y: 1 - py / window.innerHeight } })), i * 70));
      }
      setSentName(form.name.trim().split(" ")[0] || "friend");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.status === 422 ? "Please check your email and fill every field." : "Couldn't send right now. Try email instead.");
    } finally { setSending(false); }
  };

  const copyDiscord = () => { navigator.clipboard?.writeText(LINKS.discord); toast.success("Discord username copied"); };

  return (
    <section id="contact" data-testid="contact-section" className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead index="05" eyebrow="Contact" title={<>Got a project,<br />role or idea?</>} testid="contact-heading" />
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <ContactLink testid="contact-email-link" icon={Mail} label="Email" value={LINKS.email} href={`mailto:${LINKS.email}`} />
            <ContactLink testid="contact-github-link" icon={Github} label="GitHub" value="VirtualBlack2" href={LINKS.github} />
            <ContactLink testid="contact-discord-copy" icon={MessageCircle} label="Discord" value={LINKS.discord} onClick={copyDiscord} />
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            {sentName ? <MessageReceived name={sentName} onReset={() => setSentName(null)} /> : (
            <form data-testid="contact-form" name="contact" onSubmit={submit} className="space-y-4 rounded-[28px] border border-white/[0.08] bg-[#111816]/80 p-6 backdrop-blur-md sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <input data-testid="contact-input-name" required maxLength={120} value={form.name} onChange={set("name")} placeholder="Your name" className={field} />
                <input data-testid="contact-input-email" required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={field} />
              </div>
              <textarea data-testid="contact-input-message" required rows={6} maxLength={5000} value={form.message} onChange={set("message")} placeholder="Tell me what you're building…" className={`${field} resize-none`} />
              <button data-testid="contact-submit-btn" disabled={sending} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold text-[#06120c] transition-[transform,opacity] duration-300 hover:scale-[1.01] disabled:opacity-60 sm:w-auto">
                {sending ? "Sending…" : "Send message"} <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};
