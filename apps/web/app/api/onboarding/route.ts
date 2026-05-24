/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/database.types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { role } = body as { role?: string };

  if (role !== "advertiser" && role !== "publisher") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const db = createServiceClient() as any;

  // Look up user by email (the stable identifier across all auth providers)
  const { data: userRow, error: lookupError } = await db
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (lookupError || !userRow) {
    // Auto-create user row if signIn callback didn't run yet
    const { data: created, error: createError } = await db
      .from("users")
      .insert({ email: session.user.email, nextauth_sub: session.user.id ?? null })
      .select("id")
      .single();

    if (createError || !created) {
      return NextResponse.json({ error: "Failed to save role" }, { status: 500 });
    }

    userRow.id = created.id;
  }

  const userId = userRow.id;

  await db.from("users").update({ role: role as UserRole }).eq("id", userId);

  if (role === "advertiser") {
    await db.from("advertisers").upsert({ user_id: userId, balance: 0 }, { onConflict: "user_id" });
  } else {
    await db.from("publishers").upsert({ user_id: userId, revenue_share: 70, verified: false }, { onConflict: "user_id" });
  }

  return NextResponse.json({ success: true });
}
