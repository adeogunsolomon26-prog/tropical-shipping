'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function BookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    origin: '',
    destination: ''
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    const trackingNumber = `TRP-${Date.now().toString().slice(-6)}`
    
    const { error } = await supabase
      .from('bookings')
      .insert([{
        tracking_id: trackingNumber,
        customer_name: formData.name,
        email: formData.email,
        origin: formData.origin,
        destination: formData.destination,
        status: 'pending'
      }])

    setLoading(false)
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      router.push(`/thank-you?tracking=${trackingNumber}`)
    }
  }

  return (
    <div style={{padding:'20px', maxWidth:'500px', margin:'auto'}}>
      <h1>Book Shipment</h1>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Full Name - e.g John" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} style={{width:'100%',padding:'12px',margin:'6px 0'}} />
        <input required placeholder="Email - e.g tennydivina@gmail.com" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} style={{width:'100%',padding:'12px',margin:'6px 0'}} />
        <input required placeholder="Origin - e.g Caribbean" value={formData.origin} onChange={e=>setFormData({...formData, origin:e.target.value})} style={{width:'100%',padding:'12px',margin:'6px 0'}} />
        <input required placeholder="Destination - e.g Jamaica" value={formData.destination} onChange={e=>setFormData({...formData, destination:e.target.value})} style={{width:'100%',padding:'12px',margin:'6px 0'}} />
        <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',background:'black',color:'white',marginTop:'10px',border:'none',cursor:'pointer'}}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  )
}