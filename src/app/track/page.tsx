'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

const steps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

function StatusPipeline({ status }: { status: string }) {
  const currentIndex = steps.findIndex(s => s.key === status);
  if (currentIndex === -1) return null;
  
  return (
    <div style={{display:'flex', justifyContent:'space-between', margin:'30px 0', position:'relative'}}>
      {/* Progress Line */}
      <div style={{
        position:'absolute', top:22, left:25, right:25, height:4, 
        background:'#E5E7EB', zIndex:0
      }} />
      <div style={{
        position:'absolute', top:22, left:25, 
        width: `${(currentIndex / (steps.length-1)) * 100}%`, 
        maxWidth:'calc(100% - 50px)',
        height:4, background:'#10B981', zIndex:1, transition:'all 0.5s'
      }} />

      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isActive = index === currentIndex;
        return (
          <div key={step.key} style={{textAlign:'center', zIndex:2, flex:1}}>
            <div style={{
              width:45, height:45, borderRadius:'50%', margin:'0 auto 8px',
              background: isDone ? '#10B981' : 'white',
              color: isDone ? 'white' : '#9CA3AF',
              border: `3px solid ${isDone ? '#10B981' : '#E5E7EB'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:'bold', fontSize:16,
              boxShadow: isActive ? '0 0 0 4px #D1FAE5' : 'none'
            }}>
              {isDone ? '✓' : index+1}
            </div>
            <div style={{
              fontSize:11, fontWeight: isActive ? '800' : '600', 
              color: isDone ? '#065F46' : '#9CA3AF',
              textTransform:'uppercase'
            }}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('tracking');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!trackingId) {
        setLoading(false);
        setNotFound(true);
        return;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('tracking_id', trackingId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setOrder(data);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [trackingId]);

  if (loading) return <div style={{padding:80, textAlign:'center', fontFamily:'sans-serif'}}>Searching {trackingId}...</div>;
  
  if (notFound) return (
    <div style={{padding:80, textAlign:'center', fontFamily:'sans-serif'}}>
      <h2>Tracking not found: {trackingId}</h2>
      <p>Check Supabase orders table.</p>
    </div>
  );

  return (
    <div style={{minHeight:'100vh', background:'#F9FAFB', padding:'20px', fontFamily:'sans-serif'}}>
      <div style={{maxWidth:800, margin:'0 auto'}}>
        <div style={{background:'white', borderRadius:20, padding:28, boxShadow:'0 10px 30px rgba(0,0,0,0.08)', border:'1px solid #E5E7EB'}}>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <div>
              <h1 style={{fontSize:28, fontWeight:'900', margin:0}}>📦 {order.tracking_id}</h1>
              <p style={{color:'#6B7280', margin:'6px 0 0', fontSize:14}}>{order.customer_name} • {order.customer_email} • {order.customer_phone}</p>
            </div>
            <div style={{background:'#EFF6FF', color:'#1D4ED8', padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:'bold'}}>
              TROPICAL SHIPPING
            </div>
          </div>
          
          <StatusPipeline status={order.status} />

          <div style={{marginTop:10, padding:18, background:'#F0FDF4', borderRadius:14, border:'1px solid #BBF7D0'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <strong style={{color:'#065F46'}}>Current Status: {order.status.toUpperCase()}</strong>
              <span style={{fontSize:12, color:'#6B7280'}}>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <p style={{fontSize:13, marginTop:8, color:'#374151', lineHeight:1.5}}>
              {order.status === 'pending' && 'Your order has been placed and is awaiting processing at our Miami warehouse.'}
              {order.status === 'processing' && 'Your package is being processed and prepared for shipment.'}
              {order.status === 'in_transit' && 'Your package is in transit to its destination.'}
              {order.status === 'out_for_delivery' && 'Your package is out for delivery. Courier will call you.'}
              {order.status === 'delivered' && 'Your package has been delivered. Thank you for using Tropical!'}
            </p>
          </div>

          <div style={{marginTop:22, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{background:'#F9FAFB', padding:14, borderRadius:12, border:'1px solid #F3F4F6'}}>
              <div style={{fontSize:11, color:'#9CA3AF', fontWeight:'bold'}}>ORIGIN</div>
              <div style={{fontWeight:'600', marginTop:4}}>Miami, FL - Warehouse</div>
            </div>
            <div style={{background:'#F9FAFB', padding:14, borderRadius:12, border:'1px solid #F3F4F6'}}>
              <div style={{fontSize:11, color:'#9CA3AF', fontWeight:'bold'}}>DESTINATION</div>
              <div style={{fontWeight:'600', marginTop:4}}>Kingston, Jamaica</div>
            </div>
            <div style={{background:'#F9FAFB', padding:14, borderRadius:12, border:'1px solid #F3F4F6'}}>
              <div style={{fontSize:11, color:'#9CA3AF', fontWeight:'bold'}}>WEIGHT / SERVICE</div>
              <div style={{fontWeight:'600', marginTop:4}}>45 kg • Standard</div>
            </div>
            <div style={{background:'#F9FAFB', padding:14, borderRadius:12, border:'1px solid #F3F4F6'}}>
              <div style={{fontSize:11, color:'#9CA3AF', fontWeight:'bold'}}>EST. DELIVERY</div>
              <div style={{fontWeight:'600', marginTop:4, color:'#059669'}}>3-5 Business Days</div>
            </div>
          </div>

        </div>

        <p style={{textAlign:'center', fontSize:12, color:'#9CA3AF', marginTop:20}}>Need help? support@tropicalshipping.com • 1-800-555-0199</p>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{padding:80, textAlign:'center'}}>Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}