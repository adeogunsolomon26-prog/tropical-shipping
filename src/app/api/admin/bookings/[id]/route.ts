import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, isAdminUser } from "@/lib/serverAuth";
import { sendEmail } from "@/lib/email";
import { STATUSES } from "@/lib/config";

const CUSTOMS = ["Not started", "In progress", "Cleared", "On hold"];
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeCode = () =>
  "TROP-" + Array.from({ length: 6 }, () => CHARS[randomInt(CHARS.length)]).join("");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!isAdminUser(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { data } = await supabaseAdmin.from("bookings").select("*").eq("id", id).single();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let proof_url: string | null = null;
  if (data.proof_path) {
    const { data: s } = await supabaseAdmin.storage.from("proofs").createSignedUrl(data.proof_path, 3600);
    proof_url = s?.signedUrl ?? null;
  }

  const { data: events } = await supabaseAdmin
    .from("tracking_events")
    .select("id,note,location,created_at")
    .eq("booking_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ...data, proof_url, events: events ?? [] });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!isAdminUser(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const { data: cur } = await supabaseAdmin
    .from("bookings")
    .select("tracking_number,payment_status,email,name,amount,origin,destination")
    .eq("id", id)
    .single();
  if (!cur) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const upd: Record<string, unknown> = { updated_at: new Date().toISOString() };
  let mail: { subject: string; text: string } | null = null;

  if (body.action === "confirm_payment") {
    upd.payment_status = "paid";
    upd.reject_reason = null;
    upd.status = "Received";
    upd.tracking_number = cur.tracking_number || makeCode();
  } else if (body.action === "reject_payment") {
    upd.payment_status = "rejected";
    upd.reject_reason = body.reject_reason || "Payment could not be verified";
  } else if (body.action === "send_details") {
    const details = String(body.payment_instructions || "").trim();
    if (!details) {
      return NextResponse.json({ error: "Please type the payment details first" }, { status: 400 });
    }
    upd.payment_instructions = details;
    upd.payment_status = "details_sent";
    upd.reject_reason = null;
    const link = `${new URL(req.url).origin}/payment/${id}`;
    mail = {
      subject: "Your payment details - Tropical Shipping",
      text: [
        `Hello ${cur.name},`,
        "",
        `Here are the payment details for your shipment from ${cur.origin} to ${cur.destination}.`,
        `Amount: $${cur.amount}`,
        "",
        details,
        "",
        "After you pay, open this link and upload your receipt:",
        link,
        "",
        "Thank you,",
        "Tropical Shipping",
      ].join("\n"),
    };
  } else if (body.action === "add_event") {
    const note = String(body.note || "").trim();
    if (!note) {
      return NextResponse.json({ error: "Please type the update first" }, { status: 400 });
    }
    const loc = String(body.location || "").trim();
    const { error: evErr } = await supabaseAdmin
      .from("tracking_events")
      .insert({ booking_id: id, note, location: loc || null });
    if (evErr) return NextResponse.json({ error: evErr.message }, { status: 500 });
    if (loc) upd.current_location = loc;
  } else {
    if (body.status !== undefined) {
      if (!(STATUSES as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      if (cur.payment_status !== "paid") {
        return NextResponse.json({ error: "Confirm payment before changing status" }, { status: 400 });
      }
      upd.status = body.status;
    }
    if (body.amount !== undefined) upd.amount = Number(body.amount) || 0;
    if (body.customs_fee !== undefined) upd.customs_fee = Number(body.customs_fee) || 0;
    if (body.customs_status !== undefined) {
      if (!CUSTOMS.includes(body.customs_status)) {
        return NextResponse.json({ error: "Invalid customs status" }, { status: 400 });
      }
      upd.customs_status = body.customs_status;
    }
    for (const k of [
      "container",
      "pickup_date",
      "pickup_notes",
      "vessel_name",
      "voyage_number",
      "eta",
      "current_location",
      "customs_notes",
    ]) {
      if (body[k] !== undefined) upd[k] = body[k];
    }
  }

  const { error } = await supabaseAdmin.from("bookings").update(upd).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let emailed: boolean | null = null;
  if (mail && cur.email) {
    const r = await sendEmail({
      to: cur.email,
      subject: mail.subject,
      text: mail.text,
      replyTo: process.env.OWNER_EMAIL,
    });
    emailed = r.ok;
  }

  return NextResponse.json({ ok: true, emailed });
}