'use client'
import { useState } from 'react'

export default function TrackPage() {
  const [uploaded, setUploaded] = useState(false)
  return (
    <div className="min-h-screen bg-[#0a1931] flex flex-col">
      <div className="w-full h-[45vh] bg-black overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" style={{transform:'none'}}>
          <source src="/ship-ocean.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <h1 className="text-white text-xl font-bold">Tracking: TSC-VEH-001</h1>
        <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white w-[45%]"></div>
        </div>
        <div className="mt-8 bg-white rounded-xl p-6">
          <h2 className="font-bold text-black">Please Upload: Import Permit</h2>
          <input type="file" className="mt-4 w-full text-black" onChange={()=>setUploaded(true)} />
          {uploaded && <p className="mt-4 text-green-600 font-bold">✓ Uploaded</p>}
        </div>
      </div>
    </div>
  )
}