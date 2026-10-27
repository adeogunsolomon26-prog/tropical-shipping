'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function SettingsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [settings, setSettings] = useState<any[]>([])
  const [msg, setMsg] = useState('Loading...')

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('id')

      if (error) {
        setMsg('ERROR: ' + error.message)
        console.error(error)
        return
      }
      if (!data || data.length === 0) {
        setMsg('No rows found in payment_settings. Table is empty in THIS project.')
        setSettings([])
      } else {
        setMsg('')
        setSettings(data)
      }
    }
    load()
  }, [])

  const updateField = (id: string, field: string, value: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, details: { ...s.details, [field]: value } } : s
    ))
  }

  const save = async () => {
    for (const s of settings) {
      const { error } = await supabase.from('payment_settings').update({
        details: s.details,
      }).eq('id', s.id)
      if (error) alert(error.message)
    }
    alert('✅ Saved!')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-2">⚙️ PAYMENT SETTINGS</h1>
      {msg && <div className="border border-yellow-600 p-4 rounded bg-yellow-900/20 mb-6">{msg}</div>}
      
      <div className="grid gap-6">
        {settings.map((s) => (
          <div key={s.id} className="border border-gray-700 rounded-lg p-5 bg-gray-900">
            <h3 className="font-bold text-green-400 uppercase text-lg mb-4">{s.id} - {s.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(s.details || {}).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase mb-1">{key}</label>
                  <input
                    className="bg-black p-3 rounded border border-gray-700 focus:border-green-500 outline-none"
                    value={s.details[key] || ''}
                    onChange={(e) => updateField(s.id, key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {settings.length > 0 && (
        <button onClick={save} className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded font-bold w-full text-lg">
          💾 Save All
        </button>
      )}
    </div>
  )
}