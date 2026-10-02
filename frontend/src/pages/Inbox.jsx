import { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Logo } from "../components/site/Logo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Inbox() {
  const [key, setKey] = useState(() => sessionStorage.getItem("inbox_key") || "");
  const [msgs, setMsgs] = useState(null);
  const [err, setErr] = useState("");

  const load = async (e) => {
    e?.preventDefault();
    setErr("");
    try {
      const res = await axios.get(`${API}/contact`, { headers: { "X-Admin-Key": key } });
      setMsgs(Array.isArray(res.data) ? res.data : []);
      sessionStorage.setItem("inbox_key", key);
    } catch (e2) { setMsgs(null); setErr(e2?.response?.status === 401 ? "Wrong key." : "Couldn't load messages."); }
  };
  const remove = async (id) => {
    await axios.delete(`${API}/contact/${id}`, { headers: { "X-Admin-Key": key } });
    setMsgs((m) => m.filter((x) => x.id !== id));
  };

  return (
    <div className="relative z-10 min-h-screen px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="flex items-center gap-3"><Logo /><span className="font-display font-bold text-[var(--text)]">Inbox</span></a>
        <form onSubmit={load} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input data-testid="inbox-key-input" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin key"
            className="flex-1 rounded-full border border-white/10 bg-[#0d1311] px-5 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)]" />
          <button data-testid="inbox-load-btn" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#06120c]">Open inbox</button>
        </form>
        {err && <p data-testid="inbox-error" className="mt-4 text-sm text-red-400">{err}</p>}
        {msgs && (
          <div data-testid="inbox-list" className="mt-10 space-y-4">
            {msgs.length === 0 && <p className="text-[var(--muted)]">No messages yet.</p>}
            {msgs.map((m) => (
              <div key={m.id} data-testid={`inbox-msg-${m.id}`} className="rounded-3xl border border-white/10 bg-[#111816] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold text-[var(--text)]">{m.name}</p>
                    <a href={`mailto:${m.email}`} className="text-sm text-[var(--accent)]">{m.email}</a>
                  </div>
                  <button data-testid={`inbox-delete-${m.id}`} onClick={() => remove(m.id)} className="text-[var(--muted)] hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">{m.message}</p>
                <p className="font-mono-x mt-4 text-[11px] text-[var(--muted)]">{new Date(m.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
