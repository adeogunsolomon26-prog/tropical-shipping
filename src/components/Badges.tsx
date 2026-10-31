const PAY: Record<string, { label: string; adminLabel?: string; cls: string }> = {
  unpaid: { label: "Unpaid", cls: "bg-slate-100 text-slate-600" },
  details_requested: { label: "Details requested", adminLabel: "Send details", cls: "bg-sky-100 text-sky-700" },
  details_sent: { label: "Details sent", adminLabel: "Waiting for payment", cls: "bg-indigo-100 text-indigo-700" },
  awaiting_verification: { label: "Verifying payment", adminLabel: "Needs review", cls: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

export function PaymentBadge({ status, admin = false }: { status?: string; admin?: boolean }) {
  const p = PAY[status ?? "unpaid"] ?? PAY.unpaid;
  return (
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${p.cls}`}>
      {admin && p.adminLabel ? p.adminLabel : p.label}
    </span>
  );
}