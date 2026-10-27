'use client';

const steps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function StatusPipeline({ status }: { status: string }) {
  const currentIndex = steps.findIndex(s => s.key === status);
  
  return (
    <div style={{display:'flex', gap:10, margin:'30px 0', overflowX:'auto'}}>
      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isActive = index === currentIndex;
        return (
          <div key={step.key} style={{textAlign:'center', minWidth:100}}>
            <div style={{
              width:50, height:50, borderRadius:'50%', margin:'0 auto 10px',
              background: isDone ? '#10B981' : '#E5E7EB',
              color: isDone ? 'white' : '#9CA3AF',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:'bold', border: isActive ? '3px solid #065F46' : 'none'
            }}>
              {isDone ? '✓' : index+1}
            </div>
            <div style={{fontSize:12, fontWeight: isActive ? 'bold' : 'normal', color: isDone ? '#065F46' : '#6B7280'}}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}