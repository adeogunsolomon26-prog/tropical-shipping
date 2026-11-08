"use client";
import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

const TYPES = ["Bill of Lading", "Commercial Invoice", "Condition Report", "Title", "Other"];
type Doc = { id: string; type: string; file_name: string; url: string | null };

export default function DocumentsAdmin({ id }: { id: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [type, setType] = useState(TYPES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const box = "w-full rounded border border-gray-300 p-2 text-sm";

  const load = useCallback(async () => {
    const r = await authFetch(`/api/admin/bookings/${id}/documents`);
    if (r.ok) setDocs(await r.json());
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload() {
    if (!file) return setMsg("Choose a file first");
    setBusy(true);
    setMsg("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const r = await authFetch(`/api/admin/bookings/${id}/documents`, { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg(j.error || "Upload failed");
    setMsg("Uploaded ✓");
    setFile(null);
    setFileKey((k) => k + 1);
    load();
  }

  async function remove(docId: string) {
    if (!confirm("Delete this document?")) return;
    await authFetch(`/api/admin/bookings/${id}/documents?doc=${docId}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="mt-6 space-y-3 rounded-lg border p-4">
      <h3 className="font-semibold">Documents</h3>
      <select className={box} value={type} onChange={(e) => setType(e.target.value)}>
        {TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input
        key={fileKey}
        className={box}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={upload}
        disabled={busy}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        Upload document
      </button>
      {msg && <p className="text-sm">{msg}</p>}
      <ul className="space-y-2 text-sm">
        {docs.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 border-t pt-2">
            <span>
              <b>{d.type}</b>:{" "}
              {d.url ? (
                <a href={d.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {d.file_name}
                </a>
              ) : (
                d.file_name
              )}
            </span>
            <button onClick={() => remove(d.id)} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}