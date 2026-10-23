'use client'
import { useState } from 'react'

export default function TrackPage() {
  const [uploaded, setUploaded] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a1931] flex flex-col">
      <div className="w-full h-[45vh] relative overflow-hidden bg-black">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ transform: 'none' }}>
          <source src="/ship-ocean.mp4" type="video/mp4" />
          <source src="/ship.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="flex-1 bg-[#0a1931] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white text-xl font-bold">Tracking: TSC-VEH-001</h1>
          <p className="text-white/70 text-sm mt-1">En route to Jamaica</p>
          <div className="mt-6">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[45%]"></div>
            </div>
          </div>
          <div className="mt-8 bg-white rounded-xl p-6 shadow-xl">
            <h2 className="font-bold text-lg text-black">Please Upload: Import Permit / Passport ID</h2>
            <p className="text-sm text-gray-600 mt-2">Vessel paused at customs. Upload to continue.</p>
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input type="file" className="w-full text-black" onChange={() => setUploaded(true)} />
            </div>
            {uploaded && <p className="mt-4 text-green-600 text-sm font-bold">✓ Uploaded - Awaiting Admin Approval</p>}
          </div>
        </div>
      </div>
    </div>
  )
}