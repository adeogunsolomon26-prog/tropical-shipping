import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get("code") || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("bookings")
    .select(
      "id,tracking_number,status,origin,destination,container,pickup_date,vessel_name,voyage_number,eta,current_location,customs_status,updated_at"
    )
    .eq("tracking_number", code)
    .single();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: events } = await supabaseAdmin
    .from("tracking_events")
    .select("id,note,location,created_at")
    .eq("booking_id", data.id)
    .order("created_at", { ascending: false });

  // Public page: no fee, no booking ID, no customer details
  return NextResponse.json({
    tracking_number: data.tracking_number,
    status: data.status,
    origin: data.origin,
    destination: data.destination,
    container: data.container,
    pickup_date: data.pickup_date,
    vessel_name: data.vessel_name,
    voyage_number: data.voyage_number,
    eta: data.eta,
    current_location: data.current_location,
    customs_status: data.customs_status,
    updated_at: data.updated_at,
    events: events ?? [],
  });
}