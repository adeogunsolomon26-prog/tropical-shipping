import { getUser, isAdminUser } from "@/lib/serverAuth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
// ⚠️ Copy the import line for getUser and isAdminUser from the
// top of src/app/api/admin/bookings/route.ts and paste it here.

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser(req);
  if (!isAdminUser(user))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const b = await req.json();
  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  for (const k of [
    "vessel_name",
    "voyage_number",
    "eta",
    "current_location",
    "customs_status",
    "customs_fees",
  ]) {
    if (k in b) update[k] = b[k] === "" ? null : b[k];
  }

  const { error } = await supabaseAdmin
    .from("bookings")
    .update(update)
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  if (b.note || b.current_location) {
    await supabaseAdmin.from("tracking_events").insert({
      booking_id: id,
      note: b.note || null,
      location: b.current_location || null,
      status: b.status || null,
    });
  }
  return NextResponse.json({ ok: true });
}