import Link from "next/link";
import Shell from "@/components/Shell";
import QuickTrack from "@/components/QuickTrack";
import { btn, card } from "@/lib/ui";

const STEPS = [
  { n: "1", t: "Create an account", d: "Register in a minute and start a new booking." },
  { n: "2", t: "Pay your booking", d: "Pay by bank transfer, Zelle, CashApp or Chime and upload your receipt." },
  { n: "3", t: "Get your tracking number", d: "Once we confirm your payment, your tracking number appears instantly." },
  { n: "4", t: "Follow your shipment", d: "Watch it move from Received to Shipped, Customs and Delivered." },
];

const SERVICES = [
  { t: "Pickup in Miami", d: "Schedule a pickup for your cargo. Your pickup date shows on your booking." },
  { t: "Container shipping", d: "Your cargo travels in secured containers, with container details on your booking." },
  { t: "Customs support", d: "Duties, documents and clearance are tracked at every step." },
  { t: "Live tracking", d: "One tracking number from the moment we receive your shipment until delivery." },
];

export default function HomePage() {
  return (
    <Shell>
      <section className="relative isolate overflow-hidden bg-[#0a2540] text-white">
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/ship.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-[#0a2540]/70" />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-sm text-teal-200">
            Miami to the Caribbean
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Ship with confidence. Track every step.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">
            Book online, pay your way, and follow your shipment from our Miami port all the way to delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/new-booking" className={btn}>Book a shipment</Link>
            <Link href="/track" className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10">
              Track a shipment
            </Link>
          </div>
          <QuickTrack />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-[#0a2540]">How it works</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className={card}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-bold text-white">{s.n}</span>
              <h3 className="mt-4 font-semibold text-slate-900">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-[#0a2540]">Our services</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.t} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a2540] py-14 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to ship?</h2>
        <p className="mt-2 text-slate-300">Create your account and book in minutes.</p>
        <Link href="/register" className={`${btn} mt-6`}>Get started</Link>
      </section>
    </Shell>
  );
}