import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/signin?callbackUrl=/dashboard/advertiser");

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <DashboardSidebar
        role="advertiser"
        userName={session.user?.name ?? undefined}
        userEmail={session.user?.email ?? undefined}
      />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
