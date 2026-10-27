"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    bank_name: "GTBank",
    account_name: "TROPICAL SHIPPING LTD",
    account_number: "",
    cashapp: "$TropicalShip",
    chime: "$Tropical-Chime",
    zelle_email: "payments@tropical.com",
    zelle_phone: "+1 234 567 8900"
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('payment_settings').select('*').single()
    if (data) setSettings(data)
  }

  async function saveSettings() {
    setLoading(true)
    const { error } = await supabase.from('payment_settings').upsert(settings)
    setLoading(false)
    if (!error) alert("Saved!")
    else alert(error.message)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">Payment Settings</h1>
      
      <div className="max-w-2xl space-y-6 bg-zinc-900 p-6 rounded-xl">
        <div>
          <label className="block mb-2">Bank Name</label>
          <input className="w-full p-3 bg-black border border-zinc-700 rounded" 
            value={settings.bank_name} 
            onChange={e => setSettings({...settings, bank_name: e.target.value})} />
        </div>
        <div>
          <label className="block mb-2">Account Name</label>
          <input className="w-full p-3 bg-black border border-zinc-700 rounded" 
            value={settings.account_name} 
            onChange={e => setSettings({...settings, account_name: e.target.value})} />
        </div>
        <div>
          <label className="block mb-2">CashApp</label>
          <input className="w-full p-3 bg-black border border-zinc-700 rounded" 
            value={settings.cashapp} 
            onChange={e => setSettings({...settings, cashapp: e.target.value})} />
        </div>
        <div>
          <label className="block mb-2">Chime</label>
          <input className="w-full p-3 bg-black border border-zinc-700 rounded" 
            value={settings.chime} 
            onChange={e => setSettings({...settings, chime: e.target.value})} />
        </div>
        <div>
          <label className="block mb-2">Zelle Email</label>
          <input className="w-full p-3 bg-black border border-zinc-700 rounded" 
            value={settings.zelle_email} 
            onChange={e => setSettings({...settings, zelle_email: e.target.value})} />
        </div>
        <div>
          <label className="block mb-2">Zelle Phone</label>
          <input className="w-full p-3 bg-black border border-zinc-700 rounded" 
            value={settings.zelle_phone} 
            onChange={e => setSettings({...settings, zelle_phone: e.target.value})} />
        </div>

        <button 
          onClick={saveSettings} 
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded hover:bg-yellow-400">
          {loading ? "Saving..." : "Save All"}
        </button>
      </div>
    </div>
  )
}