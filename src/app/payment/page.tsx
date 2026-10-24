export default function Payment(){
  const methods = [
    {name:"Bank Transfer", desc:"ACH / Wire - Recipient name shown in app"},
    {name:"Zelle", desc:"Fast - Ask for Zelle Tag"},
    {name:"Chime", desc:"Instant - Ask for Chime Tag"},
    {name:"PayPal", desc:"Secure - Ask for PayPal Tag"},
    {name:"CashApp", desc:"Instant - Ask for $Cashtag"},
  ]
  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black text-black">Complete Payment</h1>
        <p className="text-sm opacity-60 text-black mt-1">Your tracking ID will activate after payment confirmation.</p>
        
        <div className="mt-6 space-y-3">
          {methods.map(m=>(
            <div key={m.name} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div><p className="font-bold text-black">{m.name}</p><p className="text-xs opacity-60 text-black">{m.desc}</p></div>
              <span className="text-xs bg-black text-white px-3 py-1 rounded">Tag on Request</span>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white p-6 rounded-xl">
          <h3 className="font-bold text-black">Message Support for Payment Tag</h3>
          <input placeholder="Your Email" className="w-full mt-3 p-3 border rounded-lg text-black" />
          <textarea placeholder="I need payment tag for TSC-VEH-001" className="w-full mt-3 p-3 border rounded-lg text-black" rows={3}></textarea>
          <button className="w-full mt-3 bg-[#0a1931] text-white py-3 rounded-lg font-bold">Send Message</button>
          <p className="text-[11px] opacity-50 text-black mt-3 text-center">Recipient name appears outside/in your banking app before you confirm. Do not share OTP.</p>
        </div>
      </div>
    </div>
  )
}