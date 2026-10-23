"use client"; import { useEffect, useState } from "react";
export default function ThankYou(){
const [code,setCode]=useState(""); useEffect(()=>{setCode(new URLSearchParams(window.location.search).get("code")||"");},[]);
return(<div style={{maxWidth:500,margin:"50px auto",padding:20,textAlign:"center",border:"1px solid #ddd"}}>
<h1 style={{color:"#0A1931"}}>Thank You! Name Saved</h1>
<p>Your TAG: <b>{code}</b></p>
<p>Your Name + RoRo/Container saved to Admin LIVE.</p>
<p>Email ONLY: tropicalshipping286@gmail.com</p>
<a href={`/track?code=${code}`} style={{background:"#0A1931",color:"white",padding:12,display:"inline-block",marginTop:10,textDecoration:"none"}}>Track 0% to 100% - {code}</a><br/><br/>
<a href="/">← Home</a>
</div>)}