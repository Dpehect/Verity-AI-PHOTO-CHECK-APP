"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Check, Copy, Download, ExternalLink, FileSearch, Fingerprint, Printer, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { demoAssets, formatBytes } from "@/lib/analysis";
import { useVerificationStore } from "@/store/verification-store";
import { useState } from "react";

export function EvidenceReport({ id }: { id: string }) {
  const stored = useVerificationStore((state) => state.analysis);
  const analysis = stored?.id === id ? stored : demoAssets.find((asset) => asset.id === id);
  const [copied, setCopied] = useState(false);
  if (!analysis) return <AppShell><main className="empty-report shell"><FileSearch/><h1>Report unavailable</h1><p>The local report is no longer in this browser session.</p><Link href="/verify">Start a new verification</Link></main></AppShell>;
  const status = analysis.state === "verified" ? "Credential verified" : analysis.state === "edited" ? "Valid with declared edits" : "No credential found";
  return <AppShell>
    <main className="report shell">
      <div className="report__back"><Link href="/verify"><ArrowLeft/> Verification lab</Link><div><button onClick={() => window.print()}><Printer/> Print</button><button onClick={() => window.print()}><Download/> Save PDF</button></div></div>
      <header className="report__header"><div><p className="kicker">EVIDENCE REPORT / {analysis.id.slice(0,8).toUpperCase()}</p><h1>{analysis.name}</h1><p>Generated {new Date(analysis.createdAt).toLocaleString()}</p></div><div className={`report-status report-status--${analysis.state}`}>{analysis.state === "missing" ? <AlertTriangle/> : <ShieldCheck/>}<span><small>RESULT</small><b>{status}</b></span></div></header>
      <section className="report__summary"><article><small>FILE TYPE</small><b>{analysis.mime}</b></article><article><small>FILE SIZE</small><b>{formatBytes(analysis.size)}</b></article><article><small>DIMENSIONS</small><b>{analysis.width ? `${analysis.width} × ${analysis.height}` : "Unavailable"}</b></article><article><small>INGREDIENTS</small><b>{analysis.ingredients || "None found"}</b></article></section>
      <div className="report__grid">
        <section className="report-card report-card--wide"><div className="report-card__title"><Fingerprint/><div><p className="kicker">SHA-256 FINGERPRINT</p><h2>Asset identity</h2></div></div><div className="hash"><code>{analysis.fingerprint}</code><button onClick={async()=>{await navigator.clipboard.writeText(analysis.fingerprint);setCopied(true);window.setTimeout(()=>setCopied(false),1500)}}>{copied ? <Check/> : <Copy/>}{copied ? "Copied" : "Copy"}</button></div><p>This digest identifies the exact bytes analyzed in this browser session. Any file change produces a different fingerprint.</p></section>
        <section className="report-card"><div className="report-card__title"><ShieldCheck/><div><p className="kicker">CREDENTIAL</p><h2>Provenance</h2></div></div><dl><div><dt>State</dt><dd>{status}</dd></div><div><dt>Signer</dt><dd>{analysis.signer || "Unavailable"}</dd></div><div><dt>Trust score</dt><dd>{analysis.score ? `${analysis.score}%` : "Not scored"}</dd></div></dl></section>
        <section className="report-card"><div className="report-card__title"><ExternalLink/><div><p className="kicker">INTERPRETATION</p><h2>What this means</h2></div></div><p>{analysis.state === "missing" ? "Verity did not find embedded browser-readable provenance data. Missing credentials are not evidence of manipulation and do not establish whether a claim is true or false." : "The demonstration record contains a consistent signer and edit history. Production validation will use the C2PA trust model."}</p></section>
      </div>
      <footer className="report__footer"><span>VERITY / CONTENT PROVENANCE</span><span>Report ID {analysis.id}</span></footer>
    </main>
  </AppShell>;
}
