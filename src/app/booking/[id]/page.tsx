"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Shell from "@/components/Shell";
import StatusTimeline from "@/components/StatusTimeline";
import { PaymentBadge } from "@/components/Badges";
import { useRequireAuth } from "@/lib/useAuth";
import { authFetch } from "@/lib/api";
import { btn, card } from "@/lib/ui";
import type { Booking } from "@/lib/types";

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const { loading } = useRequireAuth();
  const [b, setB] = useState<Booking | null>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loading) return;
    const load = () =>
      authFetch(`/api/bookings/${id}`).then(async (r) => {
        if (r.ok) setB(await r.json());
        else setMissing(true);
      });
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [id, loading]);

  if (missing) return <Shell><p className="p-10 text-center">Booking not found.</p></Shell>;
  if (loading || !b) return <Shell><p className="p-10 text-center text-slate-500">Loading…</p></Shell>;

  const ps = b.payment_status ?? "unpaid";

  return (
    <Shell>
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-10">
        <Link href="/dashboard" className="text-sm text-teal-600">← My dashboard</Link>

        <div className={`${card} space-y-2`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0a2540]">{b.origin} → {b.destination}</h1>
              <p className="text-slate-600">{b.cargo_description}</p>
            </div>
            <PaymentBadge status={ps} />
          </div>
          <p className="text-sm text-slate-500">Amount: ${b.amount}</p>
          {b.container && <p className="text-sm text-slate-500">Container: {b.container}</p>}
          {b.pickup_date && <p className="text-sm text-slate-500">Pickup: {b.pickup_date}</p>}
          {b.pickup_notes && <p className="text-sm text-slate-500">Pickup notes: {b.pickup_notes}</p>}
        </div>

        {b.tracking_number && (
          <div className="rounded-2xl bg-[#0a2540] p-5 text-center text-white">
            <p className="text-sm text-slate-300">Your tracking number</p>
            <p className="mt-1 font-mono text-3xl font-bold">{b.tracking_number}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(b.tracking_number ?? "");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              {copied ? "Copied ✓" : "Copy number"}
            </button>
          </div>
        )}
        
<TrackingPanel code={b.tracking_number || undefined} />
        {ps === "unpaid" && (
          <div className={`${card} text-center`}>
            <p className="text-slate-700">Your booking is waiting for payment.</p>
            <Link href={`/payment/${b.id}`} className={`${btn} mt-3`}>Choose how to pay</Link>
          </div>
        )}

        {ps === "details_requested" && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
            We received your request for payment details. We will send them by email and show them here soon. This page refreshes by itself.
          </div>
        )}

        {ps === "details_sent" && (
          <div className={`${card} space-y-3`}>
            <h2 className="font-semibold text-slate-900">Send ${b.amount} using these details</h2>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm">{b.payment_instructions}</p>
            <p className="text-sm text-slate-600">After you pay, upload your receipt so we can confirm it.</p>
            <Link href={`/payment/${b.id}`} className={btn}>I have paid: upload receipt</Link>
          </div>
        )}

        {ps === "awaiting_verification" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            We received your payment details and are verifying them. Your tracking number will appear here as soon as payment is confirmed. This page refreshes by itself.
          </div>
        )}

        {ps === "rejected" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>Your payment was not accepted: {b.reject_reason}</p>
            <Link href={`/payment/${b.id}`} className={`${btn} mt-3`}>Submit payment again</Link>
          </div>
        )}

        {ps === "paid" && (
          <div className={card}>
            <h2 className="mb-4 font-semibold text-slate-900">Shipment progress</h2>
            <StatusTimeline status={b.status} />
          </div>
        )}
      </div>
    </Shell>
  );
}

function TrackingPanel({ code }: { code?: string }) {
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/track?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then(setT)
      .catch(() => {});
  }, [code]);

  if (!t || t.error) return null;

  const rows = [
    ["Vessel", t.vessel_name],
    ["Voyage", t.voyage_number],
    ["ETA", t.eta],
    ["Current location", t.current_location],
    ["Customs", t.customs_status],
  ].filter(([, v]) => v);

  const events: any[] = t.events ?? [];

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-[#0a2540]">Shipment details</h2>
      {rows.length === 0 && (
        <p className="text-sm text-slate-500">Details will appear here once your cargo is on its way.</p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={String(k)} className="text-sm">
            <span className="text-slate-500">{k}: </span>
            <span className="font-medium">{String(v)}</span>
          </div>
        ))}
      </div>
      {events.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Update history</h3>
          <ul className="space-y-3 border-l-2 border-teal-500 pl-4">
            {events.map((e) => (
              <li key={e.id} className="text-sm">
                <div className="text-xs text-slate-500">
                  {new Date(e.created_at).toLocaleString()}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                {e.note && <div>{e.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}