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
"id,user_id,name,origin,destination,cargo_description,amount,status,payment_status,payment_method,reject_reason,tracking_number,container,pickup_date,pickup_notes,requested_method,payment_instructions,created_at,updated_at"    )
    .eq("id", id)
    .single();

  if (!data || (data.user_id !== user.id && !isAdminUser(user))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}