export default function TrackingPanel({ t }: { t: any }) {
  if (!t) return null;

  const rows = [
    ["Vessel", t.vessel_name],
    ["Voyage", t.voyage_number],
    ["ETA", t.eta],
    ["Current location", t.current_location],
    ["Customs", t.customs_status],
  ].filter(([, v]) => v);

  const events: any[] = t.events ?? [];
  if (rows.length === 0 && events.length === 0) return null;

  return (
    <div className="mt-5 rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-[#0a2540]">Shipment details</h2>
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
                  {new Date(e.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
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