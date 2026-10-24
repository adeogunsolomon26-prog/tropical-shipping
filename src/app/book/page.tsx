'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PORTS = [
"Nassau, Bahamas","Freeport, Bahamas","Kingston, Jamaica","Montego Bay, Jamaica","Port-au-Prince, Haiti","Santo Domingo, Dominican Republic","San Juan, Puerto Rico","St Thomas, USVI","St Croix, USVI","Road Town, Tortola BVI","St John's, Antigua","Bridgetown, Barbados","Port of Spain, Trinidad & Tobago","St George's, Grenada","Castries, St Lucia","Kingstown, St Vincent","Roseau, Dominica","Basseterre, St Kitts & Nevis","Providenciales, Turks & Caicos","Oranjestad, Aruba"
]

export default function Book(){
  const router = useRouter()
  const [dest, setDest] = useState(PORTS[0])
  return (
    <div className="min-h-screen bg-[#0a1931] p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 text-black">
        <h1 className="text-2xl font-black">Book RoRo or Containerized</h1>
        <p className="text-xs opacity-60 mt-2">Complete booking to get live estimate and tracking ID</p>
        
        <label className="block mt-6 text-xs font-bold">Destination - Caribbean Port</label>
        <select value={dest} onChange={e=>setDest(e.target.value)} className="w-full mt-2 p-3 border rounded-lg bg-white">
          {PORTS.map(p=> <option key={p}>{p}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <input placeholder="Full Name" className="p-3 border rounded-lg" />
          <input placeholder="Phone" className="p-3 border rounded-lg" />
        </div>
        <input placeholder="Email" className="w-full p-3 border rounded-lg mt-3" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <select className="p-3 border rounded-lg"><option>RoRo - $2747</option><option>Container 20ft - $4200</option><option>Container 40ft - $6200</option></select>
          <select className="p-3 border rounded-lg"><option>Vehicle</option><option>Personal Effects</option><option>Commercial</option></select>
        </div>

        <div className="mt-6 bg-[#0a1931] text-white p-4 rounded-xl flex justify-between">
          <span>Live Total</span><span className="font-black">$2,747 EST</span>
        </div>

        <button onClick={()=>router.push('/payment')} className="w-full mt-4 bg-[#ffcc00] py-3 font-black rounded-lg">Continue to Payment & Get Tracking ID</button>
      </div>
    </div>
  )
}