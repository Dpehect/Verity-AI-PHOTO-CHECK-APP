"use client";

/* eslint-disable @next/next/no-img-element -- previews use local blob URLs that Next Image cannot optimize */

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, FileImage, FileSearch, Fingerprint, ImageIcon, Layers3, LoaderCircle, ScanLine, ShieldCheck, Upload, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { demoAssets, formatBytes, inspectFile, type AssetAnalysis } from "@/lib/analysis";
import { useVerificationStore } from "@/store/verification-store";

type Mode = "drop" | "analyzing" | "result";

export function VerificationLab() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("drop");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Waiting for asset");
  const [result, setResult] = useState<AssetAnalysis | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const setStoredResult = useVerificationStore((state) => state.setResult);

  const analyze = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 25 * 1024 * 1024) {
      setStage(file.size > 25 * 1024 * 1024 ? "File exceeds the 25 MB browser demo limit" : "Choose a JPG, PNG, WEBP, AVIF, GIF, or TIFF image");
      return;
    }
    setMode("analyzing");
    setProgress(0);
    const url = URL.createObjectURL(file);
    setPreview(url);
    const analysis = await inspectFile(file, (value, label) => { setProgress(value); setStage(label); });
    setResult(analysis);
    setStoredResult(analysis, url);
    setMode("result");
  }, [setStoredResult]);

  const selectDemo = (analysis: AssetAnalysis) => {
    setResult(analysis);
    setPreview(null);
    setStoredResult(analysis);
    setMode("result");
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null); setResult(null); setProgress(0); setStage("Waiting for asset"); setMode("drop");
  };

  return (
    <AppShell dark>
      <main className="lab shell">
        <header className="lab__heading">
          <div><p className="kicker">VERIFICATION LAB / BROWSER DEMO</p><h1>Inspect an asset.</h1></div>
          <p>Read the file locally, calculate its SHA-256 fingerprint, and explore how a provenance report works. Your image is not uploaded.</p>
        </header>

        <div className="lab__notice"><ShieldCheck size={16}/><span><b>Private by design.</b> This frontend demo processes selected files inside your browser.</span></div>

        {mode === "drop" && (
          <section
            className={dragging ? "drop-zone is-dragging" : "drop-zone"}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void analyze(file); }}
          >
            <input ref={input} type="file" accept="image/*,.tif,.tiff" onChange={(event) => { const file = event.target.files?.[0]; if (file) void analyze(file); }} />
            <button className="drop-zone__button" onClick={() => input.current?.click()}><Upload/><span>Choose an image</span></button>
            <h2>Drop evidence here</h2><p>JPG, PNG, WEBP, AVIF, GIF or TIFF · maximum 25 MB</p>
            {stage !== "Waiting for asset" && <div className="drop-zone__error"><AlertTriangle size={15}/>{stage}</div>}
            <div className="demo-picker"><span>OR EXPLORE VERIFIED DEMO DATA</span><div>{demoAssets.slice(0, 2).map((asset, index) => <button key={asset.id} onClick={() => selectDemo(asset)}><span className={`demo-thumb demo-thumb--${index}`}><ImageIcon/></span><span><b>{asset.name}</b><small>{asset.state === "verified" ? "Credential verified" : "Valid with declared edits"}</small></span><ArrowRight/></button>)}</div></div>
          </section>
        )}

        {mode === "analyzing" && (
          <section className="analysis-progress" aria-live="polite">
            <div className="analysis-progress__media">{preview ? <img src={preview} alt="Selected asset preview"/> : <FileImage/>}<div className="analysis-progress__scan"/></div>
            <div className="analysis-progress__copy"><LoaderCircle className="spin"/><p className="kicker">ANALYSIS IN PROGRESS</p><h2>{stage}</h2><div className="progress-track"><span style={{ width: `${progress}%` }}/></div><div className="progress-meta"><span>LOCAL PROCESS</span><b>{progress}%</b></div></div>
          </section>
        )}

        {mode === "result" && result && (
          <section className="lab-result">
            <div className="lab-result__viewer">
              <div className="lab-result__toolbar"><span><FileSearch/>ASSET INSPECTOR</span><button onClick={reset}><X/> Close asset</button></div>
              <div className={`lab-result__media lab-result__media--${result.state}`}>{preview ? <img src={preview} alt={result.name}/> : <div className="generated-evidence"><span/><i/></div>}<div className="forensic-grid"/><div className="scan-beam"/><span className="coordinate coordinate--a">X 042.8</span><span className="coordinate coordinate--b">Y 781.2</span></div>
              <div className="lab-result__tools"><button className="is-active"><ScanLine/>Inspect</button><button><Layers3/>Credential layers</button><button><Fingerprint/>Fingerprint</button></div>
            </div>
            <aside className="lab-result__panel">
              <div className={`status-orb status-orb--${result.state}`}>{result.state === "missing" ? <FileSearch/> : <ShieldCheck/>}<b>{result.score || "—"}<small>{result.score ? "%" : ""}</small></b></div>
              <p className="kicker">VERIFICATION RESULT</p><h2>{result.state === "verified" ? "Credential verified" : result.state === "edited" ? "Valid with edits" : "No credential found"}</h2>
              <p>{result.state === "missing" ? "No embedded Content Credential was detected. This does not determine whether the image is true or false." : "The demo credential structure and signer chain are valid."}</p>
              <dl><div><dt>File</dt><dd>{result.name}</dd></div><div><dt>Size</dt><dd>{formatBytes(result.size)}</dd></div><div><dt>Dimensions</dt><dd>{result.width ? `${result.width} × ${result.height}` : "Unavailable"}</dd></div><div><dt>Signer</dt><dd>{result.signer || "Not available"}</dd></div><div><dt>Ingredients</dt><dd>{result.ingredients || "—"}</dd></div></dl>
              {result.warnings.length > 0 && <div className="result-warning"><AlertTriangle/>{result.warnings[0]}</div>}
              <button className="primary-action" onClick={() => router.push(`/report/${result.id}`)}>Open evidence report <ArrowRight/></button>
            </aside>
          </section>
        )}
      </main>
    </AppShell>
  );
}
