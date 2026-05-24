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
    // Runs in Node.js API route context (/api/auth/*) — safe to call Supabase here
    async signIn({ user }) {
      if (user.email) {
        try {
          const db = createServiceClient() as any;
          await db
            .from("users")
            .upsert(
              { email: user.email, nextauth_sub: user.id ?? null },
              { onConflict: "email", ignoreDuplicates: true }
            );
        } catch {
          // Non-fatal — user can still sign in; row will be created on next attempt
        }
      }
      return true;
    },

    // Keep JWT callback simple — no Supabase calls (runs in Edge runtime via middleware)
    async jwt({ token }) {
      return token;
    },

    // Keep session callback simple — no Supabase calls (runs in Edge runtime via middleware)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});
