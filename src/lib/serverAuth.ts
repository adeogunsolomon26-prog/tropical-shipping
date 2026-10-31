import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "./supabaseAdmin";

export async function getUser(req: Request): Promise<User | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export function isAdminUser(user: User | null): boolean {
  if (!user?.email || !user.email_confirmed_at) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(user.email.toLowerCase());
}