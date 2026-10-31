"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";
import { btn, card, input, label } from "@/lib/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!f.name.trim()) return setErr("Please enter your full name");
    if (f.password.length < 8) return setErr("Password must be at least 8 characters");
    if (f.password !== f.confirm) return setErr("Passwords do not match");

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.password,
      options: {
        data: { full_name: f.name.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setBusy(false);
    if (error) return setErr(error.message);
    if (data.session) router.push("/dashboard");
    else setSent(true);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md px-4 py-12">
        <div className={card}>
          {sent ? (
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-bold text-[#0a2540]">Check your email</h1>
              <p className="text-slate-600">
                We sent a confirmation link to <b>{f.email}</b>. Click it, then log in.
              </p>
              <Link href="/login" className={btn}>Go to log in</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h1 className="text-2xl font-bold text-[#0a2540]">Create your account</h1>
              <div>
                <label className={label}>Full name</label>
                <input className={input} value={f.name} onChange={set("name")} autoComplete="name" />
              </div>
              <div>
                <label className={label}>Email</label>
                <input className={input} type="email" value={f.email} onChange={set("email")} autoComplete="email" />
              </div>
              <div>
                <label className={label}>Password</label>
                <input className={input} type="password" value={f.password} onChange={set("password")} autoComplete="new-password" />
              </div>
              <div>
                <label className={label}>Confirm password</label>
                <input className={input} type="password" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" />
              </div>
              {err && <p className="text-sm text-red-600">{err}</p>}
              <button className={`${btn} w-full`} disabled={busy}>{busy ? "Creating…" : "Register"}</button>
              <p className="text-center text-sm text-slate-600">
                Already have an account? <Link href="/login" className="font-semibold text-teal-600">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}