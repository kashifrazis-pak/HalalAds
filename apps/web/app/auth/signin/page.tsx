"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SignInForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard/advertiser";
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C8.5 2 7.1 2.4 5.9 3.1C8.7 4.2 10.7 6.9 10.7 10C10.7 13.1 8.7 15.8 5.9 16.9C7.1 17.6 8.5 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2Z" fill="#C9A84C" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl text-brand-charcoal">
            Islamic<span className="text-brand-gold">AdNetwork</span>
          </span>
        </Link>

        <div className="bg-white rounded-3xl border border-brand-cream-dark p-8 shadow-brand-md">
          <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-1">Welcome back</h1>
          <p className="text-brand-muted text-sm mb-7">Sign in to your Islamic Ad Network account</p>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-brand-cream-dark bg-white hover:bg-brand-cream hover:border-brand-green/30 transition-all text-sm font-semibold text-brand-charcoal mb-5 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" />
              </svg>
            )}
            Continue with Google
          </button>

          <p className="text-center text-brand-muted text-xs">
            Magic link sign-in coming soon.
          </p>
        </div>

        <p className="text-center text-brand-muted text-xs mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/waitlist" className="text-brand-green font-semibold hover:underline">Join the waitlist</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <SignInForm />
    </Suspense>
  );
}
