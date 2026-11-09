import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, isAdminUser } from "@/lib/serverAuth";
import { listDocuments } from "@/lib/documents";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });
  const { id } = await params;

  const { data: b } = await supabaseAdmin.from("bookings").select("*").eq("id", id).single();
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const row = b as Record<string, any>;
  const mine =
    row.user_id === user.id ||
    (row.email && user.email && String(row.email).toLowerCase() === String(user.email).toLowerCase());
  if (!mine && !isAdminUser(user)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(await listDocuments(id));
}