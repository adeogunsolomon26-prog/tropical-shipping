'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTracking, setNewTracking] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const statuses = ['pending', 'processing', 'in_transit', 'out_for_delivery', 'delivered'];

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', {ascending: false});
    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function createOrder() {
    if (!newTracking) return alert('Enter tracking ID');
    const tracking = newTracking.toUpperCase().startsWith('TRP-') ? newTracking.toUpperCase() : `TRP-${newTracking.toUpperCase()}`;
    
    const { error } = await supabase.from('orders').insert({
      tracking_id: tracking,
      status: 'pending',
      customer_name: newName || 'Customer',
      customer_email: newEmail || 'customer@email.com',
      customer_phone: newPhone || '000-000-0000'
    });
    
    if (error) alert('Error: ' + error.message);
    else {
      alert(`Created: ${tracking}`);
      setNewTracking(''); setNewName(''); setNewEmail(''); setNewPhone('');
      loadOrders();
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    loadOrders();
  }

  async function deleteOrder(id: string) {
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', id);
    loadOrders();
  }

  return (
    <div style={{minHeight:'100vh', background:'#F9FAFB', padding:20, fontFamily:'sans-serif'}}>
      <div style={{maxWidth:1000, margin:'0 auto'}}>
        <h1 style={{fontSize:28, fontWeight:900}}>🔧 TROPICAL ADMIN</h1>
        <p style={{color:'#6B7280'}}>Manage all shipments</p>

        {/* CREATE */}
        <div style={{background:'white', padding:20, borderRadius:16, marginTop:20, boxShadow:'0 4px 12px rgba(0,0,0,0.05)', border:'1px solid #E5E7EB'}}>
          <h3 style={{margin:'0 0 12px', fontWeight:800}}>➕ Create New Tracking</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <input placeholder="Tracking ID: e.g. 12346 or TRP-12346" value={newTracking} onChange={e=>setNewTracking(e.target.value)} style={inputStyle} />
            <input placeholder="Customer Name" value={newName} onChange={e=>setNewName(e.target.value)} style={inputStyle} />
            <input placeholder="Email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} style={inputStyle} />
            <input placeholder="Phone" value={newPhone} onChange={e=>setNewPhone(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={createOrder} style={{marginTop:12, background:'#10B981', color:'white', border:'none', padding:'10px 20px', borderRadius:10, fontWeight:'bold', cursor:'pointer', width:'100%'}}>
            CREATE ORDER
          </button>
        </div>

        {/* LIST */}
        <div style={{background:'white', padding:20, borderRadius:16, marginTop:20, boxShadow:'0 4px 12px rgba(0,0,0,0.05)', border:'1px solid #E5E7EB'}}>
          <h3 style={{margin:'0 0 12px', fontWeight:800}}>📦 All Orders ({orders.length})</h3>
          {loading ? <p>Loading...</p> : orders.map(order => (
            <div key={order.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F3F4F6', flexWrap:'wrap', gap:10}}>
              <div style={{flex:1, minWidth:200}}>
                <div style={{fontWeight:'800'}}>{order.tracking_id} <span style={{fontSize:11, background:'#EFF6FF', color:'#1D4ED8', padding:'2px 8px', borderRadius:10}}>{order.status}</span></div>
                <div style={{fontSize:12, color:'#6B7280'}}>{order.customer_name} • {order.customer_email}</div>
                <a href={`/track?tracking=${order.tracking_id}`} target="_blank" style={{fontSize:11, color:'#10B981'}}>View Track Page →</a>
              </div>
              <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                {statuses.map(s => (
                  <button key={s} onClick={()=>updateStatus(order.id, s)} 
                    style={{
                      padding:'5px 8px', fontSize:10, borderRadius:8, border:'1px solid #E5E7EB',
                      background: order.status===s ? '#10B981' : 'white',
                      color: order.status===s ? 'white' : '#374151',
                      cursor:'pointer', fontWeight:'bold', textTransform:'uppercase'
                    }}>{s.replace('_',' ')}</button>
                ))}
                <button onClick={()=>deleteOrder(order.id)} style={{padding:'5px 8px', fontSize:10, borderRadius:8, border:'1px solid #FCA5A5', background:'#FEF2F2', color:'#DC2626', cursor:'pointer'}}>X</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:20, textAlign:'center'}}>
          <button onClick={loadOrders} style={{padding:'8px 16px', borderRadius:8, border:'1px solid #E5E7EB', background:'white', cursor:'pointer'}}>🔄 Refresh</button>
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  padding:'10px 12px', borderRadius:10, border:'1px solid #E5E7EB', fontSize:14, outline:'none'
} as const;