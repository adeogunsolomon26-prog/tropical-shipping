"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickTrack() {
  const router = useRouter();
  const [code, setCode] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) router.push(`/track?code=${encodeURIComponent(code.trim())}`);
      }}
      className="mt-8 flex max-w-md gap-2"
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter tracking number (TROP-XXXXXX)"
        className="w-full rounded-xl border-0 bg-white/95 p-3 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-300"
      />
      <button className="rounded-xl bg-teal-500 px-5 font-semibold text-white hover:bg-teal-600">Track</button>
    </form>
  );
}