'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ManualPayment({ orderId, paymentType, amount, onPaid }: any) {
  const [settings, setSettings] = useState<any[]>([])
  const [payment, setPayment] = useState<any>(null)
  const [method, setMethod] = useState('bank')
  const [ref, setRef] = useState('')
  const [file, setFile] = useState<File|null>(null)

  useEffect(()=>{ load() }, [])
  const load = async () => {
    const { data: s } = await supabase.from('payment_settings').select('*')
    const { data: p } = await supabase.from('payments').select('*').eq('order_id', orderId).eq('type', paymentType).maybeSingle()
    setSettings(s||[]); setPayment(p)
  }

  const submit = async () => {
    if(!ref || !file) return alert('Add reference + receipt')
    const path = `${orderId}/${paymentType}/${Date.now()}_${file.name}`
    const { data: up, error: upErr } = await supabase.storage.from('proofs').upload(path, file)
    if(upErr) return alert(upErr.message)
    const { error } = await supabase.from('payments').upsert({
      order_id: orderId, type: paymentType, amount, method, reference: ref, proof_file: up.path, status: 'awaiting_verification'
    }, { onConflict: 'order_id,type' } as any)
    if(error){ alert(error.message.includes('duplicate') ? 'Reference already used!' : error.message) } 
    else { alert('Submitted! Awaiting verification'); load(); onPaid?.() }
  }

  if(payment?.status==='paid') return <div style={{background:'#0f2a14', padding:'12px', border:'1px solid #22c55e', color:'#22c55e'}}>✅ PAID - {payment.method} - {payment.reference}</div>
  if(payment?.status==='awaiting_verification') return <div style={{background:'#2a1f0f', padding:'12px', border:'1px solid #f5d76e', color:'#f5d76e'}}>⏳ AWAITING VERIFICATION - {payment.reference}</div>
  if(payment?.status==='rejected') return <div style={{background:'#2a0f0f', padding:'12px', border:'1px solid red'}}><span style={{color:'red'}}>❌ REJECTED: {payment.reject_reason}</span><br/><button onClick={()=>setPayment(null)} style={{marginTop:'8px', background:'#f5d76e', color:'black', padding:'5px 10px'}}>Re-upload</button></div>

  const acc = settings.find(s=>s.method===method)
  return (
    <div style={{border:'1px solid #f5d76e', padding:'15px', background:'#111', marginTop:'10px'}}>
      <b>PAY {paymentType.toUpperCase()} - ${amount}</b>
      <select value={method} onChange={e=>setMethod(e.target.value)} style={{width:'100%', padding:'8px', marginTop:'8px', background:'black', color:'white'}}>
        <option value="bank">Bank Transfer</option><option value="zelle">Zelle</option><option value="cashapp">CashApp</option><option value="chime">Chime</option>
      </select>
      {acc && <div style={{marginTop:'10px', background:'black', padding:'10px', border:'1px dashed #f5d76e', fontSize:'13px'}}><b>{acc.account_name}</b><br/>{acc.account_number}<br/>{acc.details}<br/><b style={{color:'#f5d76e'}}>Send exactly ${amount}</b></div>}
      <input placeholder="Tran
      saction Reference" value={ref} onChange={e=>setRef(e.target.value)} style={{width:'100%', padding:'8px', marginTop:'10px', background:'black', color:'white', border:'1px solid #555'}}/>
      <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} style={{width:'100%', marginTop:'8px'}}/>
      <button onClick={submit} style={{width:'100%', marginTop:'10px', background:'#f5d76e', color:'black', padding:'10px', fontWeight:'bold'}}>SUBMIT PROOF</button>
    </div>
  )
}