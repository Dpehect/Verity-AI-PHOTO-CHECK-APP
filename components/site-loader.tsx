"use client";

import { useEffect, useState } from "react";

export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Reading the record");
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
      await document.fonts.ready;
      if (!active) return;
      setProgress(35);
      setLabel("Indexing provenance");
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      if (!active) return;
      setProgress(82);
      setLabel("Assembling the evidence");
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      setProgress(100);
      setLabel("Ready to inspect");
      await new Promise((resolve) => window.setTimeout(resolve, 320));
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
      <div className="preloader__panel preloader__panel--left" />
      <div className="preloader__panel preloader__panel--right" />
      <div className="preloader__top">
        <span>VERITY® / 2026</span>
        <span>PROVENANCE OFFICE</span>
      </div>
      <div className="preloader__center">
        <p>{label}</p>
        <div className="preloader__word" aria-hidden="true">
          {"VERITY".split("").map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </div>
        <div className="preloader__index">
          <span>IMAGE</span>
          <span>ORIGIN</span>
          <span>EVIDENCE</span>
        </div>
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
