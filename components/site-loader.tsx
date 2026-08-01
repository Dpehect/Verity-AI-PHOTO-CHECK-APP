"use client";

import { ScanLine } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Preparing interface");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("verity-intro-seen")) {
      const frame = window.requestAnimationFrame(() => {
        setProgress(100);
        setDone(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    let active = true;
    const ready = async () => {
      const webglReady = new Promise<"webgl">((resolve) =>
        window.addEventListener("verity:webgl-ready", () => resolve("webgl"), {
          once: true,
        }),
      );
      await document.fonts.ready;
      if (!active) return;
      setProgress(35);
      setLabel("Typography ready");
      const fallbackReady = new Promise<"fallback">((resolve) =>
        window.setTimeout(() => resolve("fallback"), 2400),
      );
      const renderer = await Promise.race([webglReady, fallbackReady]);
      if (!active) return;
      setProgress(82);
      setLabel(
        renderer === "webgl"
          ? "Evidence renderer ready"
          : "Accessible renderer ready",
      );
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      setProgress(100);
      setLabel("Ready to inspect");
      await new Promise((resolve) => window.setTimeout(resolve, 180));
      sessionStorage.setItem("verity-intro-seen", "1");
      setDone(true);
    };
    void ready();
    return () => {
      active = false;
    };
  }, []);
  return (
    <div
      className={`preloader ${done ? "preloader--done" : ""}`}
      aria-hidden={done}
      aria-label="Loading Verity"
    >
      <div className="preloader__top">
        <span>VERITY / SYSTEM 01</span>
        <span>CONTENT PROVENANCE</span>
      </div>
      <div className="preloader__center">
        <div className="preloader__mark">
          <ScanLine size={22} />
          <span>V</span>
        </div>
        <p>{label}</p>
      </div>
      <div className="preloader__progress">
        <span>
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </span>
        <b>{progress}%</b>
      </div>
      <button onClick={() => setDone(true)}>Skip intro</button>
    </div>
  );
}
