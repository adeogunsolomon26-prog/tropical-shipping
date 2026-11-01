import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, isAdminUser } from "@/lib/serverAuth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("bookings")
    .select(
      "id,user_id,name,origin,destination,cargo_description,amount,status,payment_status,payment_method,reject_reason,tracking_number,container,pickup_date,pickup_notes,requested_method,payment_instructions,vessel_name,voyage_number,eta,current_location,customs_status,customs_fee,customs_notes,created_at,updated_at"
    )
    .eq("id", id)
    .single();

  if (!data || (data.user_id !== user.id && !isAdminUser(user))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: events } = await supabaseAdmin
    .from("tracking_events")
    .select("id,note,location,created_at")
    .eq("booking_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ...data, events: events ?? [] });
}