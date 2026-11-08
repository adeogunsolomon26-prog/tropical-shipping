import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUser, isAdminUser } from "@/lib/serverAuth";
import { BUCKET, listDocuments } from "@/lib/documents";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const user = await getUser(req);
  if (!isAdminUser(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  return NextResponse.json(await listDocuments(id));
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await getUser(req);
  if (!isAdminUser(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const form = await req.formData();
  const file = form.get("file");
  const type = String(form.get("type") || "Other");
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "Choose a file" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024)
    return NextResponse.json({ error: "File too large (max 4 MB)" }, { status: 400 });

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${id}/${Date.now()}-${safe}`;
  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || "application/octet-stream",
    });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { error } = await supabaseAdmin
    .from("booking_documents")
    .insert({ booking_id: id, type, file_name: file.name, file_path: path });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await getUser(req);
  if (!isAdminUser(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const docId = new URL(req.url).searchParams.get("doc");
  if (!docId) return NextResponse.json({ error: "Missing doc" }, { status: 400 });

  const { data: d } = await supabaseAdmin
    .from("booking_documents")
    .select("file_path")
    .eq("id", docId)
    .eq("booking_id", id)
    .single();
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabaseAdmin.storage.from(BUCKET).remove([d.file_path]);
  await supabaseAdmin.from("booking_documents").delete().eq("id", docId);
  return NextResponse.json({ ok: true });
}