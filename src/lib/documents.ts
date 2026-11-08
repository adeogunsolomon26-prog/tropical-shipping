import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const BUCKET = "booking-documents";

export async function listDocuments(bookingId: string) {
  const { data } = await supabaseAdmin
    .from("booking_documents")
    .select("id,type,file_name,file_path,created_at")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false });

  const out = [];
  for (const d of data ?? []) {
    const { data: s } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(d.file_path, 3600);
    out.push({ id: d.id, type: d.type, file_name: d.file_name, created_at: d.created_at, url: s?.signedUrl ?? null });
  }
  return out;
}
