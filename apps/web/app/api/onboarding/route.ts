/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/database.types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { role } = body as { role?: string };

  if (role !== "advertiser" && role !== "publisher") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const userId = session.user.id;
  const db = createServiceClient();

  const { error: userError } = await (db as any)
    .from("users")
    .update({ role: role as UserRole })
    .eq("id", userId);

  if (userError) {
    return NextResponse.json({ error: "Failed to save role" }, { status: 500 });
  }

  if (role === "advertiser") {
    await (db as any)
      .from("advertisers")
      .upsert({ user_id: userId, balance: 0 }, { onConflict: "user_id" });
  } else {
    await (db as any)
      .from("publishers")
      .upsert({ user_id: userId, revenue_share: 70, verified: false }, { onConflict: "user_id" });
  }

  return NextResponse.json({ success: true });
}
