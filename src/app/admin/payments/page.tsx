'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminPayments(){
 const [pays, setPays] = useState<any[]>([])
 const load = async () => {
   const { data } = await supabase.from('payments').select('*, orders(tracking_id, customer_name)').eq('status','awaiting_verification').order('created_at',{ascending:false})
   setPays(data||[])
 }
 useEffect(()=>{ load() }, [])

 const getProofUrl = async (path:string) => {
   const { data } = await supabase.storage.from('proofs').createSignedUrl(path, 60*60)
   if(data?.signedUrl) window.open(data.signedUrl, '_blank')
 }

 const approve = async (id:string) => {
   await supabase.from('payments').update({status:'paid', confirmed_by:'admin', confirmed_at: new Date().toISOString()}).eq('id', id)
   alert('✅ Payment Approved - pipeline will unlock'); load()
 }
 const reject = async (id:string) => {
   const reason = prompt('Why reject? e.g. Wrong amount, fake receipt')
   if(!reason) return
   await supabase.from('payments').update({status:'rejected', reject_reason: reason}).eq('id', id)
   load()
 }

 return (
 <div style={{padding:'20px', background:'#000', minHeight:'100vh', color:'white'}}>
  <h2 style={{color:'#00ff99'}}>💰 PENDING PAYMENTS - {pays.length}</h2>
  {pays.length===0 && <p>No pending payments - all clear ✅</p>}
  {pays.map(p=>(
   <div key={p.id} style={{border:'1px solid #333', padding:'15px', marginTop:'15px', background:'#111'}}>
    <b>{p.orders?.tracking_id} - {p.orders?.customer_name}</b><br/>
    Type: {p.type.toUpperCase()} - ${p.amount}<br/>
    Method: {p.method} - Ref: <b style={{color:'#00ff99'}}>{p.reference}</b><br/>
    <button onClick={()=>getProofUrl(p.proof_file)} style={{marginTop:'8px', background:'#222', color:'white', padding:'6px 12px', border:'1px solid #555'}}>View Receipt</button>
    <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
     <button onClick={()=>approve(p.id)} style={{flex:1, background:'#00ff99', color:'black', padding:'10px', fontWeight:'bold'}}>✅ APPROVE</button>
     <button onClick={()=>reject(p.id)} style={{flex:1, background:'red', color:'white', padding:'10px'}}>❌ REJECT</button>
    </div>
   </div>
  ))}
 </div>
 )
}