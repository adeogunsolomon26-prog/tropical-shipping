"use client";
import { useEffect, useState } from "react";
export default function Payment(){
const [data,setData]=useState<any>(null);
const [code,setCode]=useState("");
useEffect(()=>{
const p=new URLSearchParams(window.location.search).get("code")||localStorage.getItem("lastCode")||"";
setCode(p);
const all=JSON.parse(localStorage.getItem("shipments")||"[]");
const f=all.find((s:any)=>s.code===p) || all[all.length-1];
if(f) setData(f);
},[]);
function paid(){
const all=JSON.parse(localStorage.getItem("shipments")||"[]");
const idx=all.findIndex((s:any)=>s.code===code);
if(idx>=0){all[idx].paid=true; all[idx].name=data.name; localStorage.setItem("shipments",JSON.stringify(all));}
window.location.href="/thank-you?code="+code;
}
if(!data) return <div style={{padding:20}}>Loading... No booking found. <a href="/book">Book again</a></div>;
return(<div>
<header style={{background:"#0A1931",padding:15,color:"white"}}><a href="/" style={{color:"#C9A86A"}}>← Home</a> <span style={{marginLeft:20}}>Payment - ONLY Gmail</span></header>
<div style={{maxWidth:600,margin:"20px auto",padding:20,border:"1px solid #ddd"}}>
<h2>Payment for {data.code}</h2>
<div style={{background:"#f9f9f9",padding:15,marginBottom:15}}>
<p><b>Name:</b> {data.name} (saved to Admin)</p>
<p><b>Type:</b> {data.type} - {data.vehicle}</p>
<p><b>Route:</b> {data.origin} → {data.dest}</p>
<p style={{fontSize:24,fontWeight:"bold"}}>Amount: ${data.amount.toLocaleString()}</p>
<p style={{background:"#0A1931",color:"#C9A86A",padding:10,textAlign:"center",fontWeight:"bold"}}>TAG: {data.code}</p>
</div>
<div style={{border:"2px dashed #C9A86A",padding:15,marginBottom:15}}>
<h3 style={{marginTop:0}}>Pay ONLY via Gmail:</h3>
<p style={{fontSize:20,fontWeight:"bold"}}>tropicalshipping286@gmail.com</p>
<p>Send payment confirmation + your TAG {data.code} to this Gmail ONLY. No WhatsApp.</p>
<p>Include: Name, {data.type}, Vehicle: {data.vehicle}</p>
<button onClick={()=>navigator.clipboard.writeText("tropicalshipping286@gmail.com")} style={{padding:8,background:"#eee",border:"1px solid #ccc"}}>Copy Gmail</button>
</div>
<button onClick={paid} style={{width:"100%",padding:16,background:"#0A1931",color:"white",border:"none",fontWeight:"bold",fontSize:16}}>I HAVE PAID - Confirm & Save My Name</button>
<p style={{fontSize:12,color:"gray",marginTop:10}}>Clicking I HAVE PAID will save your name + RoRo/Container to Admin and show in tracking.</p>
<div style={{marginTop:15,textAlign:"center"}}><a href={"/track?code="+code} style={{color:"#0A1931"}}>Track {data.code} - 0% to 100%</a></div>
</div>
</div>)}