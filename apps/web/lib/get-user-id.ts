/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceClient } from "@/lib/supabase";

/**
 * Looks up the public.users UUID from the user's email.
 * Email is the stable, cross-provider identifier we store at sign-in.
 * Returns null if no row exists (user hasn't completed onboarding yet).
 */
export async function getDbUserId(email: string): Promise<string | null> {
  const db = createServiceClient() as any;
  const { data } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return data?.id ?? null;
}
