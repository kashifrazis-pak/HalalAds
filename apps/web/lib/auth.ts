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
      // Look up role on sign-in or when session is explicitly updated (e.g. after onboarding)
      if (token.sub && (trigger === "signIn" || trigger === "update" || !token.role)) {
        const db = createServiceClient() as any;
        const { data } = await db
          .from("users")
          .select("role")
          .eq("id", token.sub)
          .single();
        token.role = data?.role ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as any).role = token.role ?? null;
      }
      return session;
    },
  },
});
