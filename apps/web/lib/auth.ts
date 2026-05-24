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
      const needsLookup = trigger === "signIn" || trigger === "update" || !token.dbUserId;
      if (needsLookup && token.email) {
        const db = createServiceClient() as any;
        const { data: existing } = await db
          .from("users")
          .select("id, role, nextauth_sub")
          .eq("email", token.email)
          .single();

        if (existing) {
          if (!existing.nextauth_sub && token.sub) {
            await db.from("users").update({ nextauth_sub: token.sub }).eq("id", existing.id);
          }
          token.dbUserId = existing.id;
          token.role = existing.role ?? null;
        } else {
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
        // If dbUserId isn't in the token (stale JWT), fall back to a DB lookup by email
        if (!token.dbUserId && token.email) {
          const db = createServiceClient() as any;
          const { data } = await db
            .from("users")
            .select("id, role")
            .eq("email", token.email)
            .maybeSingle();
          session.user.id = data?.id ?? "";
          (session.user as any).role = data?.role ?? null;
        } else {
          session.user.id = (token.dbUserId as string) ?? "";
          (session.user as any).role = (token.role as string) ?? null;
        }
      }
      return session;
    },
  },
});
