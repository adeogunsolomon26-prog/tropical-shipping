'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase.from('payment_settings').select('*').order('id')
    setSettings(data || [])
    setLoading(false)
  }

  async function save() {
    for (const s of settings) {
      await supabase.from('payment_settings').update({ details: s.details, label: s.label, is_active: s.is_active }).eq('id', s.id)
    }
    alert('✅ Payment details saved!')
  }

  function updateDetails(id: string, key: string, value: string) {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, details: { ...s.details, [key]: value } } : s))
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">⚙️ PAYMENT SETTINGS</h1>
      <p className="mb-6 text-gray-400">Edit your account details - customers will see these at checkout. No hard-coding.</p>

      <div className="grid gap-6">
        {settings.map((s) => (
          <div key={s.id} className="border rounded-lg p-4 bg-gray-900">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-green-400 uppercase">{s.label} ({s.id})</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={s.is_active} onChange={e => setSettings(prev => prev.map(x => x.id === s.id ? {...x, is_active: e.target.checked} : x))} />
                Active
              </label>
            </div>

            {s.id === 'bank' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className="bg-black p-2 rounded border" placeholder="Bank Name" value={s.details.bank_name || ''} onChange={e => updateDetails(s.id, 'bank_name', e.target.value)} />
                <input className="bg-black p-2 rounded border" placeholder="Account Number" value={s.details.account_number || ''} onChange={e => updateDetails(s.id, 'account_number', e.target.value)} />
                <input className="bg-black p-2 rounded border" placeholder="Account Name" value={s.details.account_name || ''} onChange={e => updateDetails(s.id, 'account_name', e.target.value)} />
              </div>
            )}
            {s.id === 'zelle' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className="bg-black p-2 rounded border" placeholder="Zelle Email" value={s.details.email || ''} onChange={e => updateDetails(s.id, 'email', e.target.value)} />
                <input className="bg-black p-2 rounded border" placeholder="Zelle Phone" value={s.details.phone || ''} onChange={e => updateDetails(s.id, 'phone', e.target.value)} />
                <input className="bg-black p-2 rounded border" placeholder="Name" value={s.details.name || ''} onChange={e => updateDetails(s.id, 'name', e.target.value)} />
              </div>
            )}
            {s.id === 'cashapp' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="bg-black p-2 rounded border" placeholder="$Cashtag" value={s.details.cashtag || ''} onChange={e => updateDetails(s.id, 'cashtag', e.target.value)} />
                <input className="bg-black p-2 rounded border" placeholder="Name" value={s.details.name || ''} onChange={e => updateDetails(s.id, 'name', e.target.value)} />
              </div>
            )}
            {s.id === 'chime' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="bg-black p-2 rounded border" placeholder="$ChimeSign" value={s.details.chime_sign || ''} onChange={e => updateDetails(s.id, 'chime_sign', e.target.value)} />
                <input className="bg-black p-2 rounded border" placeholder="Name" value={s.details.name || ''} onChange={e => updateDetails(s.id, 'name', e.target.value)} />
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={save} className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold w-full">Save All Payment Details</button>
    </div>
  )
}