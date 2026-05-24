/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  const allowed = ["active", "paused"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();
  const { data: advertiser } = await db.from("advertisers").select("id").eq("user_id", userRow?.id ?? "").single();
  if (!advertiser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await db
    .from("campaigns")
    .update({ status })
    .eq("id", params.id)
    .eq("advertiser_id", advertiser.id);

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
