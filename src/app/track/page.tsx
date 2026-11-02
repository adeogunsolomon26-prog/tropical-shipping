"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import StatusTimeline from "@/components/StatusTimeline";
import { btn, card, input } from "@/lib/ui";
import type { Booking } from "@/lib/types";
import TrackingPanel from "@/components/TrackingPanel";
async function lookup(code: string): Promise<Booking | null> {
  const r = await fetch(`/api/track?code=${encodeURIComponent(code.trim())}`);
  return r.ok ? await r.json() : null;
}

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [b, setB] = useState<Booking | null>(null);
  const [msg, setMsg] = useState("");

  async function search(c: string) {
    setMsg("");
    setB(null);
    const found = await lookup(c);
    if (found) setB(found);
    else setMsg("Tracking number not found. Please check it and try again.");
  }

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("code");
    if (c) {
      setCode(c);
      lookup(c).then((found) => {
        if (found) setB(found);
        else setMsg("Tracking number not found. Please check it and try again.");
      });
    }
  }, []);

  return (
    <Shell>
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[#0a2540]">Track your shipment</h1>
        <p className="mt-1 text-slate-600">Enter the tracking number from your booking.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) search(code);
          }}
          className="mt-6 flex gap-2"
        >
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="TROP-XXXXXX" className={`${input} font-mono`} />
          <button className={btn}>Track</button>
        </form>

        {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}

        {b && (
          <div className={`${card} mt-6 space-y-5`}>
            <div>
              <p className="font-mono text-2xl font-bold text-[#0a2540]">{b.tracking_number}</p>
              <p className="text-slate-600">{b.origin} → {b.destination}</p>
              {b.container && <p className="text-sm text-slate-500">Container: {b.container}</p>}
              {b.pickup_date && <p className="text-sm text-slate-500">Pickup: {b.pickup_date}</p>}
            </div>
            <StatusTimeline status={b.status} />
            <TrackingPanel t={b} />
          </div> 
        )}
      </div>
    </Shell>
  );
}