import { STATUSES, STATUS_HINT } from "@/lib/config";

export default function StatusTimeline({ status }: { status?: string }) {
  const step = (STATUSES as readonly string[]).indexOf(status ?? "");
  return (
    <ol>
      {STATUSES.map((s, i) => (
        <li key={s} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                i <= step ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i <= step ? "✓" : i + 1}
            </span>
            {i < STATUSES.length - 1 && (
              <span className={`h-10 w-0.5 ${i < step ? "bg-teal-500" : "bg-slate-200"}`} />
            )}
          </div>
          <div className="pb-6 pt-1">
            <p className={i === step ? "font-bold text-slate-900" : i < step ? "font-medium text-slate-700" : "text-slate-400"}>
              {s}
            </p>
            <p className="text-sm text-slate-500">{STATUS_HINT[s]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}