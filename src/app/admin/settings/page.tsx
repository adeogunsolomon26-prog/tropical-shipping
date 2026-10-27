'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function SettingsPage(){
 const [settings, setSettings] = useState<any[]>([])
 useEffect(()=>{ supabase.from('payment_settings').select('*').then(({data})=>setSettings(data||[])) }, [])
 const save = async (s:any) => {
   await supabase.from('payment_settings').update({account_name:s.account_name, account_number:s.account_number, details:s.details, is_active:s.is_active}).eq('id', s.id)
   alert('Saved!')
 }
 return (
 <div style={{padding:'20px', background:'#000', minHeight:'100vh', color:'white'}}>
  <h2 style={{color:'#00ff99'}}>⚙️ PAYMENT SETTINGS</h2>
  {settings.map((s:any)=>(
   <div key={s.id} style={{border:'1px solid #333', padding:'15px', marginTop:'15px', background:'#111'}}>
    <b style={{textTransform:'uppercase', color:'#00ff99'}}>{s.method}</b><br/>
    <input value={s.account_name} onChange={e=>setSettings(settings.map(x=>x.id===s.id?{...x, account_name:e.target.value}:x))} style={{width:'100%', marginTop:'8px', padding:'8px', background:'black', color:'white'}} placeholder="Account Name"/>
    <input value={s.account_number} onChange={e=>setSettings(settings.map(x=>x.id===s.id?{...x, account_number:e.target.value}:x))} style={{width:'100%', marginTop:'8px', padding:'8px', background:'black', color:'white'}} placeholder="Account Number / Email / $tag"/>
    <input value={s.details} onChange={e=>setSettings(settings.map(x=>x.id===s.id?{...x, details:e.target.value}:x))} style={{width:'100%', marginTop:'8px', padding:'8px', background:'black', color:'white'}} placeholder="Details - e.g. Chase Bank Routing"/>
    <button onClick={()=>save(s)} style={{marginTop:'10px', background:'#00ff99', color:'black', padding:'8px 15px', fontWeight:'bold'}}>SAVE</button>
   </div>
  ))}
 </div>
 )
}