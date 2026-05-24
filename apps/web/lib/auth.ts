/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { SupabaseVerificationAdapter } from "@/lib/auth-adapter";
import { createServiceClient } from "@/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: SupabaseVerificationAdapter(),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Islamic Ad Network <noreply@islamicadnetwork.com>",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, trigger }) {
      const needsLookup =
        trigger === "signIn" || trigger === "update" || !token.dbUserId;

      if (needsLookup && token.email) {
        const db = createServiceClient() as any;

        // Find existing user by email
        const { data: existing } = await db
          .from("users")
          .select("id, role, nextauth_sub")
          .eq("email", token.email)
          .single();

        if (existing) {
          // Backfill nextauth_sub if missing
          if (!existing.nextauth_sub && token.sub) {
            await db.from("users").update({ nextauth_sub: token.sub }).eq("id", existing.id);
          }
          token.dbUserId = existing.id;
          token.role = existing.role ?? null;
        } else {
          // Auto-create user row on first sign-in (NextAuth handles auth, not Supabase Auth)
          const { data: created } = await db
            .from("users")
            .insert({ email: token.email, nextauth_sub: token.sub ?? null, role: null })
            .select("id, role")
            .single();
          if (created) {
            token.dbUserId = created.id;
            token.role = null;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Use the real DB UUID as the user ID so all Supabase queries work
        session.user.id = (token.dbUserId as string) ?? token.sub ?? "";
        (session.user as any).role = token.role ?? null;
      }
      return session;
    },
  },
});
