"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";
import { btn, card, input, label } from "@/lib/ui";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [recovery, setRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setRecovery(true);
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    setBusy(false);
    if (error) return setErr(error.message);
    setMsg("If that email has an account, a reset link is on its way.");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (password.length < 8) return setErr("Password must be at least 8 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setErr(error.message);
    router.push("/dashboard");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md px-4 py-12">
        {recovery ? (
          <form onSubmit={savePassword} className={`${card} space-y-4`}>
            <h1 className="text-2xl font-bold text-[#0a2540]">Set a new password</h1>
            <div>
              <label className={label}>New password</label>
              <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className={`${btn} w-full`} disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
          </form>
        ) : (
          <form onSubmit={sendLink} className={`${card} space-y-4`}>
            <h1 className="text-2xl font-bold text-[#0a2540]">Reset your password</h1>
            <p className="text-sm text-slate-600">Enter your email and we will send you a reset link.</p>
            <div>
              <label className={label}>Email</label>
              <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
            <button className={`${btn} w-full`} disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
            <p className="text-center text-sm"><Link href="/login" className="text-teal-600">Back to log in</Link></p>
          </form>
        )}
      </div>
    </Shell>
  );
}