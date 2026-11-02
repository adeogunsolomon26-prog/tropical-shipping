"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Shell from "@/components/Shell";
import { PaymentBadge } from "@/components/Badges";
import { useRequireAuth } from "@/lib/useAuth";
import { authFetch } from "@/lib/api";
import { PAYMENT_METHODS, STATUSES } from "@/lib/config";
import { btn, btnDark, card, input, label } from "@/lib/ui";
import type { Booking } from "@/lib/types";

export default function AdminBookingPage() {
  const { id } = useParams<{ id: string }>();
  const { loading } = useRequireAuth();
  const [b, setB] = useState<Booking | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "denied" | "missing">("loading");
  const [f, setF] = useState({ amount: "", container: "", pickup_date: "", pickup_notes: "" });
  const [instr, setInstr] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const r = await authFetch(`/api/admin/bookings/${id}`);
    if (r.status === 401 || r.status === 403) return setState("denied");
    if (!r.ok) return setState("missing");
    const data: Booking = await r.json();
    setB(data);
    setF({
      amount: String(data.amount ?? 0),
      container: data.container ?? "",
      pickup_date: data.pickup_date ?? "",
      pickup_notes: data.pickup_notes ?? "",
    });
    setInstr((cur) => cur || data.payment_instructions || "");
    setState("ok");
  }, [id]);

  useEffect(() => {
    if (!loading) load();
  }, [loading, load]);

  async function patch(body: Record<string, unknown>) {
    setMsg("");
    const r = await authFetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (r.ok) {
      if (body.action === "send_details") {
        setMsg(
          data.emailed
            ? "Details saved and emailed to the customer ✓"
            : "Details saved ✓ The email could not be sent, but the customer can see the details on their payment page."
        );
      } else {
        setMsg("Saved ✓");
      }
    } else {
      setMsg(data.error || "Failed");
    }
    await load();
  }

  if (state === "denied") return <Shell><p className="p-10 text-center text-red-600">You do not have access to this page.</p></Shell>;
  if (state === "missing") return <Shell><p className="p-10 text-center">Booking not found.</p></Shell>;
  if (state === "loading" || !b) return <Shell><p className="p-10 text-center text-slate-500">Loading…</p></Shell>;

  const ps = b.payment_status ?? "unpaid";
  const paid = ps === "paid";
  const requestedLabel = PAYMENT_METHODS.find((m) => m.id === b.requested_method)?.label ?? b.requested_method;
  const showRequest =
    ps === "details_requested" || ps === "details_sent" || (ps === "rejected" && !!b.requested_method);

  return (
    <Shell>
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-10">
        <Link href="/admin" className="text-sm text-teal-600">← All bookings</Link>

        <div className={`${card} space-y-1`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0a2540]">{b.name}</h1>
              <p className="text-sm text-slate-500">{b.email}</p>
            </div>
            <PaymentBadge status={ps} admin />
          </div>
          <p>{b.origin} → {b.destination}</p>
          <p className="text-sm text-slate-600">{b.cargo_description}</p>
          {b.notes && <p className="text-sm text-slate-500">Customer notes: {b.notes}</p>}
          {b.tracking_number && <p className="pt-1 font-mono font-bold">{b.tracking_number}</p>}
        </div>

        {showRequest && (
          <div className={`${card} space-y-3 text-sm`}>
            <h2 className="font-semibold">Payment details request</h2>
            <p>Method: <b>{requestedLabel}</b></p>
            <p>Customer {requestedLabel} info: <b>{b.customer_handle}</b></p>
            <div>
              <label className={label}>Where should the customer pay? (account, tag, or email)</label>
              <textarea
                className={input}
                rows={5}
                value={instr}
                onChange={(e) => setInstr(e.target.value)}
                placeholder={"Example:\nZelle: name@email.com\nName: Tropical Shipping"}
              />
            </div>
            <button className={btn} onClick={() => patch({ action: "send_details", payment_instructions: instr })}>
              {ps === "details_sent" ? "Update and resend details" : "Send details to customer"}
            </button>
          </div>
        )}

        {(ps === "awaiting_verification" || paid) && (
          <div className={`${card} space-y-2 text-sm`}>
            <h2 className="font-semibold">Payment</h2>
            <p>Method: <b>{b.payment_method}</b> · Payer: <b>{b.payer_name}</b></p>
            <p>Reference: <span className="font-mono">{b.payment_reference}</span></p>
            {b.proof_url && (
              <a href={b.proof_url} target="_blank" rel="noreferrer" className="text-teal-600 underline">View proof screenshot</a>
            )}
            {ps === "awaiting_verification" && (
              <div className="flex gap-2 pt-2">
                <button
                  className={btn}
                  onClick={() => {
                    if (confirm("Confirm you can SEE this money in your account?")) patch({ action: "confirm_payment" });
                  }}
                >
                  Confirm payment
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                  onClick={() => {
                    const reason = prompt("Reason for rejecting?");
                    if (reason) patch({ action: "reject_payment", reject_reason: reason });
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {ps === "rejected" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Rejected: {b.reject_reason}
          </div>
        )}

        <div className={`${card} space-y-4`}>
          <h2 className="font-semibold">Shipment details</h2>
          <div>
            <label className={label}>Status {!paid && "(unlocks after payment is confirmed)"}</label>
            <select disabled={!paid} value={b.status ?? ""} onChange={(e) => patch({ status: e.target.value })} className={`${input} disabled:bg-slate-100`}>
              {!paid && <option>{b.status}</option>}
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Amount ($)</label>
              <input className={input} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
            </div>
            <div>
              <label className={label}>Container</label>
            <select
  className={input}
  value={f.container}
  onChange={(e) => setF({ ...f, container: e.target.value })}
>
  <option value="">Select…</option>
  <option value="Container shipping">Container shipping</option>
  <option value="RORO">RORO</option>
</select>
           </div>
<div>
<label className={label}>Pickup date</label>
              <input className={input} value={f.pickup_date} onChange={(e) => setF({ ...f, pickup_date: e.target.value })} placeholder="Example: Nov 12" />
            </div>
            <div>
              <label className={label}>Pickup notes</label>
              <input className={input} value={f.pickup_notes} onChange={(e) => setF({ ...f, pickup_notes: e.target.value })} />
            </div>
          </div>
          <button className={btnDark} onClick={() => patch({ ...f })}>Save details</button>
        </div>

        {msg && <p className="text-sm text-slate-600">{msg}</p>}
      </div>
  <div className="mx-auto max-w-2xl px-4 pb-10">
  <TrackingForm id={id} />
</div>
</Shell>
  );
}
function TrackingForm({ id, initial }: { id: string; initial?: any }) {
  const [f, setF] = useState({
    vessel_name: initial?.vessel_name ?? "",
    voyage_number: initial?.voyage_number ?? "",
    eta: initial?.eta ?? "",
    current_location: initial?.current_location ?? "",
    customs_status: initial?.customs_status ?? "",
    customs_fees: initial?.customs_fees ?? "",
    note: "",
  });
  const [msg, setMsg] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const box = "w-full rounded border border-gray-300 p-2 text-sm";

  async function save() {
    setMsg("Saving...");
    const r = await authFetch(`/api/admin/bookings/${id}/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    setMsg(r.ok ? "Saved ✓" : "Failed to save");
    if (r.ok) setF({ ...f, note: "" });
  }

  return (
    <div className="mt-6 rounded-lg border p-4 space-y-3">
      <h3 className="font-semibold">Tracking details</h3>
      <input className={box} placeholder="Vessel name" value={f.vessel_name} onChange={set("vessel_name")} />
      <input className={box} placeholder="Voyage number" value={f.voyage_number} onChange={set("voyage_number")} />
      <label className="block text-xs text-slate-500">ETA (estimated arrival)</label>
<input className={`${box} block min-w-0 appearance-none bg-white`} type="date" value={f.eta} onChange={set("eta")} />
      <input className={box} placeholder="Current location / port" value={f.current_location} onChange={set("current_location")} />
      <input className={box} placeholder="Customs status" value={f.customs_status} onChange={set("customs_status")} />
      <input className={box} type="number" placeholder="Customs / documentation fees" value={f.customs_fees} onChange={set("customs_fees")} />
      <textarea className={box} placeholder="Update note (shows on the tracking page)" value={f.note} onChange={set("note")} />
      <button onClick={save} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">Save tracking update</button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}