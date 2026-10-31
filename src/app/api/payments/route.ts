import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser } from "@/lib/serverAuth";
import { PAYMENT_METHODS } from "@/lib/config";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return fail("Please log in", 401);

  const f = await req.formData();
  const id = String(f.get("id") || "");
  const method = String(f.get("method") || "");
  const reference = String(f.get("reference") || "").trim();
  const payer = String(f.get("payer_name") || "").trim();
  const file = f.get("file");

  if (!id || !method || !reference || !payer) return fail("Please fill in all fields");
  if (!PAYMENT_METHODS.some((m) => m.id === method)) return fail("Invalid payment method");

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("user_id,payment_status")
    .eq("id", id)
    .single();
  if (!booking || booking.user_id !== user.id) return fail("Booking not found", 404);
  if (!["unpaid", "rejected", "details_requested", "details_sent"].includes(booking.payment_status)) {
    return fail("Payment already submitted for this booking");
  }

  // Block the same receipt/reference from being used twice
  const { data: dup } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("payment_reference", reference)
    .neq("id", id)
    .in("payment_status", ["awaiting_verification", "paid"])
    .limit(1);
  if (dup && dup.length > 0) return fail("This transaction reference was already used", 409);

  const update: Record<string, unknown> = {
    payment_status: "awaiting_verification",
    payment_method: method,
    payment_reference: reference,
    payer_name: payer,
    reject_reason: null,
    updated_at: new Date().toISOString(),
  };

  if (file instanceof File && file.size > 0) {
    if (file.size > 4 * 1024 * 1024) return fail("Image must be under 4MB");
    if (!file.type.startsWith("image/")) return fail("Proof must be an image (screenshot or photo)");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${id}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("proofs")
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (upErr) return fail("Could not upload proof: " + upErr.message, 500);
    update.proof_path = path;
  }

  const { error } = await supabaseAdmin.from("bookings").update(update).eq("id", id);
  if (error) return fail(error.message, 500);
  return NextResponse.json({ ok: true });
}