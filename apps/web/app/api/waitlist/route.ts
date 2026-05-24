import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, type, company } = body;

    if (!name || !email || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In production: insert to Supabase waitlist table + send welcome email via Resend
    console.log("waitlist signup", { name, email, type, company, ts: new Date().toISOString() });

    return NextResponse.json({ success: true, message: "Added to waitlist" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
