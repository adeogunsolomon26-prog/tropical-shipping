import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser } from "@/lib/serverAuth";
import { sendEmail } from "@/lib/email";
import { PAYMENT_METHODS } from "@/lib/config";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return fail("Please log in", 401);

  const { id, method, handle } = await req.json();
  const m = PAYMENT_METHODS.find((x) => x.id === method);
  if (!id || !m) return fail("Please choose a payment method");

  const customerHandle = String(handle || "").trim();
  if (!customerHandle) return fail("Please enter your tag, email or account name for this method");

  const { data: b } = await supabaseAdmin
    .from("bookings")
    .select("user_id,name,origin,destination,amount,payment_status")
    .eq("id", id)
    .single();
  if (!b || b.user_id !== user.id) return fail("Booking not found", 404);
  if (!["unpaid", "rejected", "details_requested"].includes(b.payment_status)) {
    return fail("Payment details were already sent for this booking");
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({
      requested_method: m.id,
      customer_handle: customerHandle,
      payment_status: "details_requested",
      reject_reason: null,
      details_requested_at: now,
      updated_at: now,
    })
    .eq("id", id);
  if (error) return fail(error.message, 500);

  let emailed = false;
  const owner = process.env.OWNER_EMAIL;
  if (owner) {
    const link = `${new URL(req.url).origin}/admin/booking/${id}`;
    const r = await sendEmail({
      to: owner,
      subject: `Payment details requested: ${b.name} ($${b.amount})`,
      text: [
        "A customer is asking for payment details.",
        "",
        `Customer: ${b.name} (${user.email})`,
        `Route: ${b.origin} to ${b.destination}`,
        `Amount: $${b.amount}`,
        `Method chosen: ${m.label}`,
        `Their ${m.label} info: ${customerHandle}`,
        "",
        `Open in Admin and send the details: ${link}`,
        "Reply to this email to contact the customer directly.",
      ].join("\n"),
      replyTo: user.email ?? undefined,
    });
    emailed = r.ok;
  }

  return NextResponse.json({ ok: true, emailed });
}