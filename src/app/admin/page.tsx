"use client";
import { useEffect, useState } from "react";
export default function Admin(){
const [auth,setAuth]=useState(false); const [pass,setPass]=useState(""); const [shipments,setShipments]=useState<any[]>([]); const [search,setSearch]=useState("");
useEffect(()=>{ if(auth) load(); },[auth]);
function load(){ const all=JSON.parse(localStorage.getItem("shipments")||"[]"); setShipments(all.reverse()); }
function login(){ if(pass==="admin123"){setAuth(true);} else alert("Password is admin123"); }
function updateStatus(code:string,newStatus:number){
let all=JSON.parse(localStorage.getItem("shipments")||"[]");
const i=all.findIndex((s:any)=>s.code===code); if(i>=0){all[i].status=newStatus; localStorage.setItem("shipments",JSON.stringify(all)); load();}
}
function togglePaid(code:string){
let all=JSON.parse(localStorage.getItem("shipments")||"[]");
const i=all.findIndex((s:any)=>s.code===code); if(i>=0){all[i].paid=!all[i].paid; localStorage.setItem("shipments",JSON.stringify(all)); load();}
}
function del(code:string){
if(!confirm("Delete "+code+"?")) return;
let all=JSON.parse(localStorage.getItem("shipments")||"[]").filter((s:any)=>s.code!==code);
localStorage.setItem("shipments",JSON.stringify(all)); load();
}
const filtered=shipments.filter(s=> s.code.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
if(!auth) return(<div style={{maxWidth:400,margin:"100px auto",padding:20,border:"1px solid #ddd"}}>
<h2>Admin Login</h2>
<p>Separate Admin - Tropical Shipping</p>
<input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter password: admin123" style={{width:"100%",padding:10,marginBottom:10}}/>
<button onClick={login} style={{width:"100%",padding:12,background:"#0A1931",color:"white",border:"none"}}>Login</button>
<p style={{fontSize:12,marginTop:10}}>Password: admin123 (change later)</p>
</div>);
return(<div>
<header style={{background:"#0A1931",padding:15,color:"white",display:"flex",justifyContent:"space-between"}}>
<span>Admin - Name + RoRo/Container + 0-100% LIVE Control</span><a href="/" style={{color:"#C9A86A"}}>View Site</a>
</header>
<div style={{padding:20}}>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by TAG, Name, Email..." style={{width:"100%",maxWidth:400,padding:10,marginBottom:20}}/>
<p>Total Bookings: {filtered.length} | Gmail ONLY: tropicalshipping286@gmail.com</p>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:"#0A1931",color:"white"}}><th style={{padding:8}}>TAG / Name</th><th style={{padding:8}}>RoRo / Container</th><th style={{padding:8}}>Amount / Paid</th><th style={{padding:8}}>0% to 100% Control</th><th style={{padding:8}}>Action</th></tr></thead>
<tbody>
{filtered.map(s=>(
<tr key={s.code} style={{borderBottom:"1px solid #ddd",background:s.paid?"#E8F5E9":"#FFF"}}>
<td style={{padding:8}}><b>{s.code}</b><br/>{s.name}<br/><span style={{color:"gray"}}>{s.email}</span><br/>{s.origin}→{s.dest}</td>
<td style={{padding:8}}><b style={{color:s.type==="RoRo"?"#0A1931":"#C9A86A"}}>{s.type}</b><br/>{s.vehicle}</td>
<td style={{padding:8}}>${s.amount}<br/><span style={{background:s.paid?"green":"orange",color:"white",padding:"2px 6px"}}>{s.paid?"PAID - Name Saved":"UNPAID"}</span></td>
<td style={{padding:8}}>
<div style={{display:"flex",alignItems:"center",gap:5}}>
<input type="range" min="0" max="100" step="20" value={s.status||0} onChange={e=>updateStatus(s.code,parseInt(e.target.value))} style={{width:80}}/>
<b>{s.status||0}%</b>
</div>
<div style={{background:"#eee",height:8,marginTop:5}}><div style={{width:`${s.status||0}%`,height:"100%",background:"#0A1931"}}></div></div>
<select value={s.status||0} onChange={e=>updateStatus(s.code,parseInt(e.target.value))} style={{marginTop:5,padding:4}}>
<option value={0}>0% Booking Received</option><option value={20}>20% Payment Confirmed</option><option value={40}>40% Vehicle Received</option><option value={60}>60% Loaded</option><option value={80}>80% In Transit</option><option value={100}>100% Arrived</option>
</select>
</td>
<td style={{padding:8}}>
<button onClick={()=>togglePaid(s.code)} style={{padding:4,marginBottom:4,width:"100%"}}>{s.paid?"Mark Unpaid":"Mark Paid"}</button><br/>
<button onClick={()=>window.open(`/track?code=${s.code}`,'_blank')} style={{padding:4,marginBottom:4,width:"100%"}}>View Track</button><br/>
<button onClick={()=>del(s.code)} style={{padding:4,background:"red",color:"white",border:"none",width:"100%"}}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>)}