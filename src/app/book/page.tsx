"use client";
import { useState } from "react";
export default function Book(){
const [type,setType]=useState("RoRo");
const [vehicle,setVehicle]=useState("Sedan");
const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [origin,setOrigin]=useState("Miami, FL");
const [dest,setDest]=useState("Bahamas");
const base = type==="RoRo"? 2997 : 3747;
const extra = vehicle==="SUV"?400:vehicle==="Truck"?800:vehicle==="Container 20ft"?0:vehicle==="Container 40ft"?1200:0;
const total = base + extra;
function submit(e:any){
e.preventDefault();
const code="TSC-"+Math.floor(100000+Math.random()*900000);
const data={code,name,email,type,vehicle,origin,dest,amount:total,status:0,paid:false,date:new Date().toISOString()};
const all=JSON.parse(localStorage.getItem("shipments")||"[]"); all.push(data); localStorage.setItem("shipments",JSON.stringify(all)); localStorage.setItem("lastCode",code);
window.location.href="/payment?code="+code;
}
return(<div>
<header style={{background:"#0A1931",padding:15,color:"white"}}><a href="/" style={{color:"#C9A86A"}}>← Home</a> <span style={{marginLeft:20,fontWeight:"bold"}}>Book Shipment - RoRo / Containerized</span></header>
<div style={{maxWidth:600,margin:"20px auto",padding:20,border:"1px solid #ddd"}}>
<h2>Book RoRo or Containerized</h2>
<p>Contact ONLY: tropicalshipping286@gmail.com</p>
<form onSubmit={submit}>
<label>Full Name (will show in Admin)</label><br/><input required value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:10,marginBottom:10}} placeholder="John Doe"/><br/>
<label>Email (Gmail)</label><br/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:10,marginBottom:10}} placeholder="you@gmail.com"/><br/>
<label>Shipping Type</label><br/>
<div style={{display:"flex",gap:10,marginBottom:10}}>
<button type="button" onClick={()=>setType("RoRo")} style={{flex:1,padding:12,background:type==="RoRo"?"#0A1931":"#eee",color:type==="RoRo"?"white":"black",border:"none",fontWeight:"bold"}}>RoRo - $2997 base</button>
<button type="button" onClick={()=>setType("Containerized")} style={{flex:1,padding:12,background:type==="Containerized"?"#0A1931":"#eee",color:type==="Containerized"?"white":"black",border:"none",fontWeight:"bold"}}>Containerized - $3747 base</button>
</div>
<label>Vehicle / Container</label><br/>
<select value={vehicle} onChange={e=>setVehicle(e.target.value)} style={{width:"100%",padding:10,marginBottom:10}}>
<option>Sedan</option><option>SUV (+$400)</option><option>Truck (+$800)</option><option>Container 20ft</option><option>Container 40ft (+$1200)</option>
</select><br/>
<label>Origin</label><br/><input value={origin} onChange={e=>setOrigin(e.target.value)} style={{width:"100%",padding:10,marginBottom:10}}/><br/>
<label>Destination</label><br/>
<select value={dest} onChange={e=>setDest(e.target.value)} style={{width:"100%",padding:10,marginBottom:10}}>
<option>Bahamas</option><option>Jamaica</option><option>Barbados</option><option>Trinidad</option><option>Guyana</option><option>Antigua</option>
</select><br/>
<div style={{background:"#0A1931",color:"white",padding:15,margin:"15px 0"}}><div>LIVE Price: {type} + {vehicle}</div><div style={{fontSize:28,fontWeight:"bold",color:"#C9A86A"}}>${total.toLocaleString()}</div></div>
<button type="submit" style={{width:"100%",padding:14,background:"#C9A86A",border:"none",fontWeight:"bold",fontSize:16}}>Continue to Payment - Get TSC Tag</button>
</form>
</div>
</div>)}