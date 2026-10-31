"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { useRequireAuth } from "@/lib/useAuth";
import { authFetch } from "@/lib/api";
import { PAYMENT_METHODS } from "@/lib/config";
import { btn, card, input, label } from "@/lib/ui";
import type { Booking } from "@/lib/types";

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { loading } = useRequireAuth();
  const [b, setB] = useState<Booking | null>(null);
  const [missing, setMissing] = useState(false);
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [handle, setHandle] = useState("");
  const [payer, setPayer] = useState("");
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const r = await authFetch(`/api/bookings/${id}`);
    if (r.ok) setB(await r.json());
    else setMissing(true);
  }, [id]);

  useEffect(() => {
    if (loading) return;
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [loading, load]);

  async function requestDetails(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setNote("");
    if (!handle.trim()) return setErr("Please enter your tag, email or account name for this method");
    setBusy(true);
    const r = await authFetch("/api/payment-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, method, handle }),
    });
    const data = await r.json();
    setBusy(false);
    if (!r.ok) return setErr(data.error || "Something went wrong");
    setNote("Request sent. We will send you the payment details shortly.");
    await load();
  }

  async function submitProof(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!payer.trim() || !reference.trim()) return setErr("Please fill in your name and the transaction reference");
    const fd = new FormData();
    fd.append("id", String(id));
    fd.append("method", b?.requested_method || method);
    fd.append("payer_name", payer);
    fd.append("reference", reference);
    if (file) fd.append("file", file);

    setBusy(true);
    const r = await authFetch("/api/payments", { method: "POST", body: fd });
    const data = await r.json();
    setBusy(false);
    if (r.ok) router.push(`/booking/${id}`);
    else setErr(data.error || "Something went wrong");
  }

  if (missing) return <Shell><p className="p-10 text-center">Booking not found.</p></Shell>;
  if (loading || !b) return <Shell><p className="p-10 text-center text-slate-500">Loading…</p></Shell>;

  const ps = b.payment_status ?? "unpaid";

  if (ps === "paid" || ps === "awaiting_verification") {
    return (
      <Shell>
        <div className="mx-auto max-w-md space-y-3 p-10 text-center">
          <p>Payment has already been submitted for this booking.</p>
          <Link href={`/booking/${id}`} className={btn}>View booking</Link>
        </div>
      </Shell>
    );
  }

  const hasDetails = !!b.payment_instructions && (ps === "details_sent" || ps === "rejected");
  const requestedLabel =
    PAYMENT_METHODS.find((m) => m.id === b.requested_method)?.label ?? "your chosen method";
  const chosenLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label ?? "payment";

  return (
    <Shell>
      <div className="mx-auto max-w-xl space-y-5 px-4 py-10">
        <h1 className="text-3xl font-bold text-[#0a2540]">Complete your payment</h1>

        {ps === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Your last payment was not accepted: {b.reject_reason}. Please submit it again.
          </div>
        )}

        <div className={card}>
          <p className="font-semibold">{b.origin} → {b.destination}</p>
          <p className="text-sm text-slate-500">{b.cargo_description}</p>
          <p className="mt-2 text-2xl font-bold text-[#0a2540]">Amount due: ${b.amount}</p>
        </div>

        {hasDetails ? (
          <>
            <div className={`${card} space-y-2`}>
              <p className="font-semibold">1. Send exactly ${b.amount} using these details ({requestedLabel})</p>
              <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm">{b.payment_instructions}</p>
            </div>

            <form onSubmit={submitProof} className={`${card} space-y-4`}>
              <p className="font-semibold">2. Tell us what you sent</p>
              <div>
                <label className={label}>Name on the payment</label>
                <input className={input} value={payer} onChange={(e) => setPayer(e.target.value)} />
              </div>
              <div>
                <label className={label}>Transaction reference / ID</label>
                <input className={input} value={reference} onChange={(e) => setReference(e.target.value)} />
              </div>
              <div>
                <label className={label}>Screenshot of receipt (recommended)</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
              </div>
              {err && <p className="text-sm text-red-600">{err}</p>}
              <button className={`${btn} w-full`} disabled={busy}>{busy ? "Submitting…" : "I have paid"}</button>
            </form>
          </>
        ) : ps === "details_requested" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            We received your request for <b>{requestedLabel}</b>. We will send you the payment details by email and on this page. This page updates by itself.
          </div>
        ) : (
          <form onSubmit={requestDetails} className={`${card} space-y-4`}>
            <p className="font-semibold">1. Choose how you will pay</p>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`rounded-xl border p-3 text-sm ${
                    method === m.id ? "border-teal-500 bg-teal-50 font-semibold" : "border-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div>
              <label className={label}>Your {chosenLabel} tag, email or account name</label>
              <input className={input} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="So we can match your payment" />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            {note && <p className="text-sm text-emerald-700">{note}</p>}
            <button className={`${btn} w-full`} disabled={busy}>{busy ? "Sending…" : "Request payment details"}</button>
            <p className="text-xs text-slate-500">We will confirm your request and send you where to pay.</p>
          </form>
        )}
      </div>
    </Shell>
  );
}