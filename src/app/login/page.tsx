"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";
import { btn, card, input, label } from "@/lib/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setErr(error.message);
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={submit} className={`${card} space-y-4`}>
          <h1 className="text-2xl font-bold text-[#0a2540]">Welcome back</h1>
          <div>
            <label className={label}>Email</label>
            <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label className={label}>Password</label>
            <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className={`${btn} w-full`} disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
          <div className="flex justify-between text-sm text-slate-600">
            <Link href="/forgot-password" className="text-teal-600">Forgot password?</Link>
            <Link href="/register" className="font-semibold text-teal-600">Create account</Link>
          </div>
        </form>
      </div>
    </Shell>
  );
}