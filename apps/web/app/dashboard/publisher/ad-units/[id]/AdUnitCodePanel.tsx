"use client";

import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";

interface Props {
  unitId: string;
  size: string;
  name: string;
}

export default function AdUnitCodePanel({ unitId, size, name }: Props) {
  const [copied, setCopied] = useState(false);

  const snippet = `<!-- Islamic Ad Network: ${name} -->
<div
  id="ha-ad-unit"
  data-unit="${unitId}"
  data-size="${size}"
></div>
<script src="//cdn.islamicadnetwork.com/a.js" async></script>`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
      <h2 className="font-display font-bold text-brand-charcoal text-lg mb-2 flex items-center gap-2">
        <Code2 size={18} className="text-brand-green" /> Embed Code
      </h2>
      <p className="text-brand-muted text-sm mb-5">Paste this snippet anywhere before the closing &lt;/body&gt; tag on your site.</p>

      <div className="bg-brand-charcoal rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
          <span className="text-white/40 text-xs font-mono">embed code · {size}</span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-brand-gold transition-colors"
          >
            {copied ? <><Check size={12} className="text-brand-green" /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <pre className="p-5 text-xs font-mono text-white/80 overflow-x-auto whitespace-pre">{snippet}</pre>
      </div>

      <div className="mt-5 bg-brand-green/5 border border-brand-green/20 rounded-xl p-4">
        <p className="text-brand-green text-sm font-medium">Tips for best performance</p>
        <ul className="text-brand-muted text-xs mt-1.5 space-y-1 list-disc list-inside">
          <li>Place above-the-fold ads for up to 3× higher RPM</li>
          <li>The script loads asynchronously — it won&apos;t slow your page</li>
          <li>Each page load will automatically serve the best-paying ad</li>
        </ul>
      </div>
    </div>
  );
}
