import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser } from "@/lib/serverAuth";
import { BOOKING_FEE, DESTINATIONS, ORIGINS } from "@/lib/config";

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const { origin, destination, cargo_description, notes } = await req.json();
  if (!ORIGINS.includes(origin) || !DESTINATIONS.includes(destination)) {
    return NextResponse.json({ error: "Invalid origin or destination" }, { status: 400 });
  }
  if (!cargo_description || !String(cargo_description).trim()) {
    return NextResponse.json({ error: "Please describe your cargo" }, { status: 400 });
  }

  const name = (user.user_metadata?.full_name as string) || user.email || "Customer";
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      user_id: user.id,
      name,
      email: user.email,
      origin,
      destination,
      cargo_description: String(cargo_description).trim(),
      notes: notes ? String(notes).trim() : null,
      amount: BOOKING_FEE,
      status: "Pending Payment",
      payment_status: "unpaid",
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id,origin,destination,cargo_description,amount,status,payment_status,tracking_number,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}