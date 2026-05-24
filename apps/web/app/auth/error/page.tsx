"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign-in link has expired or already been used. Please request a new one.",
  OAuthSignin: "Could not start the Google sign-in process. Please try again.",
  OAuthCallback: "Something went wrong during Google sign-in. Please try again.",
  OAuthCreateAccount: "Could not create your account. Please contact support.",
  EmailCreateAccount: "Could not create your account. Please contact support.",
  Callback: "Something went wrong. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to a different sign-in method.",
  EmailSignin: "The magic link email could not be sent. Please try again.",
  CredentialsSignin: "Invalid credentials.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An unexpected error occurred. Please try again.",
};

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
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
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-2">Sign-in error</h1>
          <p className="text-brand-muted text-sm mb-7">{message}</p>
          <Link href="/auth/signin" className="btn-primary w-full block text-center py-3">
            Try again
          </Link>
        </div>

        <p className="text-center text-brand-muted text-xs mt-6">
          Need help?{" "}
          <a href="mailto:hello@islamicadnetwork.com" className="text-brand-green font-semibold hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <ErrorContent />
    </Suspense>
  );
}
