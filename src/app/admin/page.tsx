"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { PaymentBadge } from "@/components/Badges";
import { useRequireAuth } from "@/lib/useAuth";
import { authFetch } from "@/lib/api";
import { card } from "@/lib/ui";
import type { Booking } from "@/lib/types";

export default function AdminPage() {
  const { loading } = useRequireAuth();
  const [rows, setRows] = useState<Booking[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (loading) return;
    authFetch("/api/admin/bookings").then(async (r) => {
      if (r.status === 401 || r.status === 403) return setState("denied");
      if (r.ok) {
        setRows(await r.json());
        setState("ok");
      }
    });
  }, [loading]);

  if (state === "denied") {
    return <Shell><p className="p-10 text-center text-red-600">You do not have access to this page.</p></Shell>;
  }
  if (state === "loading") return <Shell><p className="p-10 text-center text-slate-500">Loading…</p></Shell>;

  const count = (s: string) => rows.filter((r) => r.payment_status === s).length;
  const shown = rows
    .filter((r) => filter === "all" || r.payment_status === filter)
    .sort((a, b) => Number(b.payment_status === "awaiting_verification") - Number(a.payment_status === "awaiting_verification"));

  const stats = [
    { k: "all", label: "All bookings", v: rows.length },
    { k: "awaiting_verification", label: "Needs review", v: count("awaiting_verification") },
    { k: "paid", label: "Paid", v: count("paid") },
    { k: "unpaid", label: "Unpaid", v: count("unpaid") },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-[#0a2540]">Admin dashboard</h1>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <button
              key={s.k}
              onClick={() => setFilter(s.k)}
              className={`${card} text-left ${filter === s.k ? "border-teal-500 ring-2 ring-teal-200" : ""}`}
            >
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-3xl font-bold text-[#0a2540]">{s.v}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {shown.length === 0 && <p className="text-slate-500">No bookings here.</p>}
          {shown.map((b) => (
            <Link key={b.id} href={`/admin/booking/${b.id}`} className={`${card} block transition hover:border-teal-400`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-sm text-slate-500">{b.email}</p>
                  <p className="text-sm">{b.origin} → {b.destination}</p>
                  {b.tracking_number && <p className="font-mono text-sm font-bold">{b.tracking_number}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <PaymentBadge status={b.payment_status} admin />
                  {b.payment_status === "paid" && (
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{b.status}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}