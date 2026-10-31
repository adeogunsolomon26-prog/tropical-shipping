import { NextResponse } from "next/server";
import { getUser, isAdminUser } from "@/lib/serverAuth";

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ isAdmin: false }, { status: 401 });
  return NextResponse.json({ isAdmin: isAdminUser(user) });
}