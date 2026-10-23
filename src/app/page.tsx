"use client";
export default function Home(){
return(<div>
<header style={{background:"#0A1931",padding:15,display:"flex",justifyContent:"space-between",color:"white"}}>
<b>TROPICAL SHIPPING</b>
<div><a href="/book" style={{color:"#C9A86A",marginRight:15}}>Book</a><a href="/track" style={{color:"white",marginRight:15}}>Track</a><a href="/admin" style={{color:"white"}}>Admin</a></div>
</header>
<div style={{position:"relative",height:"65vh",overflow:"hidden",background:"#000"}}>
<video autoPlay muted loop playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}><source src="/hero.mp4" type="video/mp4"/></video>
<div style={{position:"absolute",inset:0,background:"rgba(10,25,49,0.6)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"white",textAlign:"center"}}>
<h1 style={{fontSize:32,margin:0}}>Miami to Caribbean Shipping</h1><p>RoRo $2997 | Container $3747 LIVE</p>
<a href="/book" style={{background:"#C9A86A",color:"#0A1931",padding:"14px 24px",fontWeight:"bold",textDecoration:"none",marginTop:10}}>Book Now</a>
<p style={{marginTop:10}}>ONLY Gmail: tropicalshipping286@gmail.com</p>
</div>
</div>
</div>)}