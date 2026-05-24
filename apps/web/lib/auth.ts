/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { createServiceClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/database.types";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  callbacks: {
    async jwt({ token, trigger }) {
      if (trigger === "signIn" || trigger === "signUp" || !token.role) {
        const db = createServiceClient();
        const { data } = await (db as any)
          .from("users")
          .select("role")
          .eq("id", token.sub)
          .single();
        token.role = (data?.role as UserRole) ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as { id: string; role?: UserRole | null }).role =
          (token.role as UserRole) ?? null;
      }
      return session;
    },
  },
});
