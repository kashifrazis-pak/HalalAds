/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, siteUrl, size } = await req.json();

  if (!name || !siteUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = createServiceClient() as any;

  const { data: userRow } = await db
    .from("users").select("id").eq("email", session.user.email).maybeSingle();

  if (!userRow) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: publisher } = await db
    .from("publishers").select("id").eq("user_id", userRow.id).single();

  if (!publisher) return NextResponse.json({ error: "Publisher not found" }, { status: 404 });

  const { data: unit, error } = await db
    .from("ad_units")
    .insert({
      publisher_id: publisher.id,
      name,
      site_url: siteUrl,
      size: size || "300x250",
      placement: "in-content",
    })
    .select("id")
    .single();

  if (error || !unit) {
    return NextResponse.json({ error: "Failed to create ad unit" }, { status: 500 });
  }

  return NextResponse.json({ id: unit.id });
}
