"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { authFetch } from "@/lib/api";
import { BRAND, CONTACT } from "@/lib/config";

function Logo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-teal-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l1.5 3h15L21 17H3z" />
      <path d="M5 17v-5h14v5" />
      <path d="M9 12V8h6v4" />
      <path d="M12 8V5" />
    </svg>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setIsAdmin(false);
      return;
    }
    authFetch("/api/admin/me").then(async (r) => {
      if (r.ok) setIsAdmin((await r.json()).isAdmin === true);
    });
  }, [loggedIn]);

  async function logout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
  }

  const link = "text-sm font-medium text-slate-200 hover:text-white";
  const close = () => setOpen(false);

  const links = (
    <>
      <Link href="/" className={link} onClick={close}>Home</Link>
      <Link href="/track" className={link} onClick={close}>Track</Link>
      {loggedIn ? (
        <>
          <Link href="/dashboard" className={link} onClick={close}>My Dashboard</Link>
          {isAdmin && <Link href="/admin" className="text-sm font-semibold text-amber-300 hover:text-amber-200" onClick={close}>Admin</Link>}
          <button onClick={logout} className={link}>Log out</button>
        </>
      ) : (
        <>
          <Link href="/login" className={link} onClick={close}>Log in</Link>
          <Link href="/register" onClick={close} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-[#0a2540] text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Logo />
            {BRAND}
          </Link>
          <button className="rounded-lg border border-white/30 px-3 py-1 text-sm md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? "Close" : "Menu"}
          </button>
          <nav className="hidden items-center gap-6 md:flex">{links}</nav>
        </div>
        {open && <nav className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 md:hidden">{links}</nav>}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0a2540] text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm md:grid-cols-3">
          <div>
            <p className="font-bold text-white">{BRAND}</p>
            <p className="mt-1">Shipping from Miami to the Caribbean.</p>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <p className="mt-1">{CONTACT.email}</p>
            <p>{CONTACT.phone}</p>
            <p>{CONTACT.address}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Quick links</p>
            <p className="mt-1"><Link href="/track" className="hover:text-white">Track a shipment</Link></p>
            <p><Link href="/new-booking" className="hover:text-white">Book a shipment</Link></p>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs">
          © {new Date().getFullYear()} {BRAND}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}