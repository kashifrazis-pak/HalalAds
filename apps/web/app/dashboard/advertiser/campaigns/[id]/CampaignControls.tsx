"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play, Loader2 } from "lucide-react";

interface Props {
  campaignId: string;
  status: string;
}

export default function CampaignControls({ campaignId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status === "pending_review" || status === "rejected" || status === "completed" || status === "draft") {
    return null;
  }

  const isActive = status === "active";

  async function toggle() {
    setLoading(true);
    try {
      await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: isActive ? "paused" : "active" }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-cream-dark bg-white text-sm font-medium text-brand-charcoal hover:bg-brand-cream transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : isActive ? <Pause size={13} /> : <Play size={13} />}
      {isActive ? "Pause" : "Activate"}
    </button>
  );
}
