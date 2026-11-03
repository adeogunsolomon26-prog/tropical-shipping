"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { DESTINATIONS, PAYMENT_METHODS, CONTACT, priceFor } from "@/lib/config";

type Msg = { from: "bot" | "me"; text: string };

const CODE = /TROP-[A-Z0-9]{6}/i;
const CHIPS = ["Track my shipment", "Prices", "How do I pay?", "Contact us"];

async function trackReply(code: string): Promise<string> {
  try {
    const r = await fetch(`/api/track?code=${encodeURIComponent(code)}`);
    if (!r.ok) return "I couldn't find that tracking number. Please check it and try again.";
    const t = await r.json();
    const lines = [`${t.tracking_number}: ${t.origin} → ${t.destination}`, `Status: ${t.status}`];
    if (t.current_location) lines.push(`Location: ${t.current_location}`);
    if (t.eta) lines.push(`ETA: ${t.eta}`);
    if (t.customs_status) lines.push(`Customs: ${t.customs_status}`);
    const last = t.events?.[0];
    if (last?.note) lines.push(`Latest update: ${last.note}`);
    return lines.join("\n");
  } catch {
    return "Sorry, I couldn't check that right now. Please try again in a moment.";
  }
}

async function answer(text: string): Promise<string> {
  const code = text.match(CODE)?.[0];
  if (code) return trackReply(code.toUpperCase());

  const t = text.toLowerCase();

  if (/(price|cost|how much|rate|quote)/.test(t)) {
    const hit = DESTINATIONS.find((d: string) => t.includes(d.toLowerCase()));
    if (hit)
      return `Shipping a car or SUV from Miami to ${hit} is $${priceFor(hit)}. For boxes, barrels or other cargo, please contact us for a quote.`;
    return (
      "Car or SUV from Miami:\n" +
      DESTINATIONS.map((d: string) => `• ${d}: $${priceFor(d)}`).join("\n") +
      "\nFor boxes, barrels or other cargo, please contact us for a quote."
    );
  }

  if (/(pay|zelle|cash ?app|chime|bank|transfer)/.test(t))
    return `You can pay by ${PAYMENT_METHODS.map((m) => m.label).join(", ")}. After you book, choose a method on the payment page and we'll email you the payment details. Then pay and upload your proof.`;

  if (/(track|where|status|shipment)/.test(t))
    return "Send me your tracking number (it looks like TROP-XXXXXX) and I'll check it for you.";

  if (/(contact|email|call|human|owner|help)/.test(t))
    return `You can reach us at ${CONTACT.email}.`;

  if (/^(hi|hello|hey)/.test(t))
    return "Hello! I can track a shipment, share prices, or explain how to pay. What do you need?";

  return `I'm not sure about that one. I can track a shipment, share prices, or explain payment. For anything else, email ${CONTACT.email}.`;
}

export default function Assistant() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm Captain Tropi ⚓ I can track your shipment, share prices, or explain how to pay." },
  ]);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  if (path?.startsWith("/admin")) return null;

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setBusy(true);
    const a = await answer(q);
    setMsgs((m) => [...m, { from: "bot", text: a }]);
    setBusy(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="flex items-center gap-3 bg-[#0a2540] px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-xl">🧑‍✈️</span>
            <div>
              <p className="text-sm font-semibold">Captain Tropi</p>
              <p className="text-xs text-teal-200">Tropical Shipping assistant</p>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    m.from === "me" ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {busy && <p className="text-xs text-slate-400">Captain Tropi is typing…</p>}
            <div ref={end} />
          </div>

          <div className="flex flex-wrap gap-2 px-3 pb-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="rounded-full border border-teal-500 px-3 py-1 text-xs text-teal-700"
              >
                {c}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or tracking number"
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <button className="rounded-lg bg-[#0a2540] px-3 py-2 text-sm text-white">Send</button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat with Captain Tropi"
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-2xl shadow-lg"
      >
        {open ? "✕" : "🧑‍✈️"}
      </button>
    </div>
  );
}