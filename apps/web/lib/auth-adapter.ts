import type { Adapter } from "next-auth/adapters";
import { createServiceClient } from "@/lib/supabase";

/**
 * Minimal NextAuth adapter — only implements verification token methods.
 * Required for magic link (Resend) with JWT session strategy.
 * Full user/session methods are omitted because we use JWT (not DB sessions)
 * and manage user rows via the Supabase auth trigger instead.
 */
export function SupabaseVerificationAdapter(): Adapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = () => createServiceClient() as any;

  return {
    async createVerificationToken({ identifier, token, expires }) {
      await db()
        .from("verification_tokens")
        .insert({ identifier, token, expires: expires.toISOString() });
      return { identifier, token, expires };
    },

    async useVerificationToken({ identifier, token }) {
      const { data } = await db()
        .from("verification_tokens")
        .select("*")
        .eq("identifier", identifier)
        .eq("token", token)
        .single();

      if (!data) return null;

      await db()
        .from("verification_tokens")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token);

      return {
        identifier: data.identifier,
        token: data.token,
        expires: new Date(data.expires),
      };
    },

    // Stubs — NextAuth v5 with JWT strategy never calls these
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createUser(user: any) { return { ...user, id: user.email ?? "" }; },
    async getUser() { return null; },
    async getUserByEmail() { return null; },
    async getUserByAccount() { return null; },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateUser(user: any) { return { ...user, id: user.id ?? "" }; },
    async linkAccount() { return undefined; },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createSession(s: any) { return s; },
    async getSessionAndUser() { return null; },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateSession(s: any) { return s; },
    async deleteSession() { return undefined; },
  };
}
