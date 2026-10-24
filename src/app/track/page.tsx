'use client'
import { useState } from 'react'

export default function Track(){
  const [file, setFile] = useState<File|null>(null)
  return (
    <div className="min-h-screen bg-[#0a1931] flex flex-col">
      <div className="w-full h-[40vh] bg-black overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src="/ship-ocean.mp4" /></video>
      </div>
      <div className="max-w-xl mx-auto w-full p-6 -mt-12 relative">
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <p className="text-xs font-bold opacity-50">TRACKING ID</p><h1 className="text-xl font-black">TSC-VEH-001</h1>
          <div className="mt-4 h-2 bg-black/10 rounded-full"><div className="h-full bg-[#0a1931] w-[45%] rounded-full"></div></div>
          <p className="mt-2 text-xs">In Transit - Miami Port</p>
          
          <div className="mt-8 border-2 border-dashed rounded-xl p-8 text-center">
            <p className="font-bold">Upload Import Permit</p><p className="text-xs opacity-60 mt-1">Required to clear customs at destination</p>
            <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden" id="f" />
            <label htmlFor="f" className="mt-4 inline-block bg-[#0a1931] text-white px-6 py-2 rounded-lg text-sm cursor-pointer">{file? file.name : "Select Document"}</label>
            {file && <p className="mt-3 text-xs text-green-600 font-bold">✓ Ready to submit - Document verified</p>}
          </div>
        </div>
      </div>
    </div>
  )
}