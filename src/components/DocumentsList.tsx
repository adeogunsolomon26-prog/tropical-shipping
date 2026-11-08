"use client";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

type Doc = { id: string; type: string; file_name: string; url: string | null };

export default function DocumentsList({ id }: { id: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    authFetch(`/api/bookings/${id}/documents`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setDocs)
      .catch(() => {});
  }, [id]);

  if (docs.length === 0) return null;

  return (
    <div className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-[#0a2540]">Your documents</h2>
      <ul className="space-y-2 text-sm">
        {docs.map((d) => (
          <li key={d.id} className="flex justify-between gap-3">
            <span>{d.type}</span>
            {d.url && (
              <a href={d.url} target="_blank" rel="noreferrer" className="text-teal-700 underline">
                Download
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}