"use client";

import { ScanLine } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("verity-intro-seen")) {
      const frame = window.requestAnimationFrame(() => { setProgress(100); setDone(true); });
      return () => window.cancelAnimationFrame(frame);
    }
    let active = true;
    const ready = async () => {
      await document.fonts.ready;
      for (const value of [18, 41, 67, 86, 100]) {
        if (!active) return;
        setProgress(value);
        await new Promise((resolve) => window.setTimeout(resolve, value === 100 ? 260 : 120));
      }
      sessionStorage.setItem("verity-intro-seen", "1");
      setDone(true);
    };
    void ready();
    return () => { active = false; };
  }, []);
  return <div className={`preloader ${done ? "preloader--done" : ""}`} aria-hidden={done} aria-label="Loading Verity">
    <div className="preloader__top"><span>VERITY / SYSTEM 01</span><span>CONTENT PROVENANCE</span></div>
    <div className="preloader__center"><div className="preloader__mark"><ScanLine size={22}/><span>V</span></div><p>{progress < 41 ? "Loading interface" : progress < 86 ? "Preparing evidence scene" : "Ready to inspect"}</p></div>
    <div className="preloader__progress"><span><i style={{transform:`scaleX(${progress/100})`}}/></span><b>{progress}%</b></div>
    <button onClick={()=>setDone(true)}>Skip intro</button>
  </div>;
}
