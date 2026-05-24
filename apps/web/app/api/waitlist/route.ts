import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import type { WaitlistType } from "@/lib/database.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, type, company } = body as {
      name?: string;
      email?: string;
      type?: string;
      company?: string;
    };

    if (!name?.trim() || !email?.trim() || !type?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (type !== "advertiser" && type !== "publisher") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const db = createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (db as any).from("waitlist").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      type: type as WaitlistType,
      company: company?.trim() || null,
      source: req.headers.get("referer") ?? "website",
    });

    if (error) {
      // Unique constraint on email — already signed up
      if (error.code === "23505") {
        return NextResponse.json(
          { success: true, message: "Already on the waitlist" },
          { status: 201 }
        );
      }
      console.error("waitlist insert error", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Added to waitlist" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
