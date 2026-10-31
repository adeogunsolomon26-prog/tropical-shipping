"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { PaymentBadge } from "@/components/Badges";
import { useRequireAuth } from "@/lib/useAuth";
import { authFetch } from "@/lib/api";
import { btn, card } from "@/lib/ui";
import type { Booking } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const [rows, setRows] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (loading) return;
    authFetch("/api/bookings").then(async (r) => {
      if (r.ok) setRows(await r.json());
    });
  }, [loading]);

  const first = ((user?.user_metadata?.full_name as string) || "").split(" ")[0];

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#0a2540]">Hello{first ? `, ${first}` : ""}</h1>
            <p className="text-slate-600">Your shipments in one place.</p>
          </div>
          <Link href="/new-booking" className={btn}>New booking</Link>
        </div>

        <div className="mt-8 space-y-3">
          {rows === null && <p className="text-slate-500">Loading…</p>}
          {rows && rows.length === 0 && (
            <div className={`${card} text-center`}>
              <p className="text-slate-600">You have no bookings yet.</p>
              <Link href="/new-booking" className={`${btn} mt-4`}>Book your first shipment</Link>
            </div>
          )}
          {rows?.map((b) => (
            <Link key={b.id} href={`/booking/${b.id}`} className={`${card} block transition hover:border-teal-400`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{b.origin} → {b.destination}</p>
                  <p className="text-sm text-slate-500">{b.cargo_description}</p>
                  {b.tracking_number && <p className="mt-1 font-mono text-sm font-bold text-[#0a2540]">{b.tracking_number}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <PaymentBadge status={b.payment_status} />
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