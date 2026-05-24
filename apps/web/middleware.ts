import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/lib/database.types";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isAuthed = !!session;
  const role = (session?.user as { role?: UserRole | null } | undefined)?.role;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
    if (!isAuthed) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (pathname.startsWith("/dashboard") && isAuthed && !role) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (pathname === "/onboarding" && isAuthed && role) {
    const dest = role === "advertiser" ? "/dashboard/advertiser" : "/dashboard/publisher";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
