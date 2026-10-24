'use client'
import Link from 'next/link'

export default function Home(){
  return (
    <div className="min-h-screen bg-[#0a1931] text-white">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="font-black tracking-widest text-sm">TROPICAL SHIPPING</h1>
        <div className="flex gap-6 text-xs opacity-70">
          <Link href="/book">Book</Link><Link href="/track">Track</Link><Link href="/contact">Contact</Link>
        </div>
      </nav>

      {/* Hero - Video STRAIGHT */}
      <div className="relative w-full h-[78vh] overflow-hidden bg-black">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/ship-ocean.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1931]/90 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full p-8">
            <h2 className="text-5xl font-black leading-[0.9] max-w-lg">Miami to Caribbean Shipping</h2>
            <p className="mt-4 max-w-md opacity-80 text-sm">RORO & Containerized • Weekly Sailings • Licensed & Insured • Port to Port Delivery</p>
            <p className="mt-2 text-xs opacity-60">Rate as low as $2747 LIVE</p>
            <Link href="/book"><button className="mt-6 bg-[#ffcc00] text-black px-8 py-3 font-black text-sm rounded">BOOK NOW - LIVE RATE</button></Link>
            <div className="mt-6 flex gap-6 text-[10px] opacity-50">
              <span>✓ 24/7 Tracking</span><span>✓ Customs Support</span><span>✓ Since 2012</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}