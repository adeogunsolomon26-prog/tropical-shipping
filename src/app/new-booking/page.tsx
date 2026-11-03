"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { useRequireAuth } from "@/lib/useAuth";
import { authFetch } from "@/lib/api";
import { priceFor, DESTINATIONS, ORIGINS } from "@/lib/config";
import { btn, card, input, label } from "@/lib/ui";

export default function NewBookingPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [destination, setDestination] = useState("");
  const [cargo, setCargo] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!destination) return setErr("Please choose a destination");
    if (!cargo.trim()) return setErr("Please describe your cargo");
    setBusy(true);
    const r = await authFetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, cargo_description: cargo, notes }),
    });
    const data = await r.json();
    setBusy(false);
    if (r.ok) router.push(`/payment/${data.id}`);
    else setErr(data.error || "Something went wrong");
  }

  if (loading) return <Shell><p className="p-10 text-center text-slate-500">Loading…</p></Shell>;

  return (
    <Shell>
      <div className="mx-auto max-w-xl px-4 py-10">
        <form onSubmit={submit} className={`${card} space-y-4`}>
          <h1 className="text-2xl font-bold text-[#0a2540]">New booking</h1>
          <p className="text-sm text-slate-600">
            Booking for <b>{(user?.user_metadata?.full_name as string) || user?.email}</b>
          </p>
          <div>
            <label className={label}>From</label>
            <select className={input} value={origin} onChange={(e) => setOrigin(e.target.value)}>
              {ORIGINS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Destination</label>
            <select className={input} value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="">Choose a destination</option>
              {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>What are you shipping?</label>
            <textarea className={input} rows={3} value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Example: 2 barrels of household items" />
          </div>
          <div>
            <label className={label}>Notes (optional)</label>
            <textarea className={input} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Pickup address, special instructions" />
          </div>
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Booking amount: <b>${priceFor(destination)}</b>. You will pay on the next step.
          </p>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className={`${btn} w-full`} disabled={busy}>{busy ? "Creating…" : "Continue to payment"}</button>
        </form>
      </div>
    </Shell>
  );
}