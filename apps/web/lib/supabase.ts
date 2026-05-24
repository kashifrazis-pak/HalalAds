import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Lazy client — created on first call so build-time evaluation doesn't throw on missing env vars
export function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Service client bypasses RLS — only use in server-side API routes, never in client components
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Keep named export for backward-compat with any existing usage
export const supabase = {
  get client() { return getSupabaseClient(); },
};
