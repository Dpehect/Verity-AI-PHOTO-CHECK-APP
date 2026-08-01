"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  FileSearch,
  Layers3,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { SiteLoader } from "@/components/site-loader";
import { EvidenceArtwork } from "@/components/evidence-artwork";
import {
  ClosingSection,
  ManifestSection,
  WorkspacePreview,
} from "@/components/landing-static-sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const samples = [
  {
    name: "Editorial capture",
    type: "JPG · 18.4 MB",
    status: "Verified",
    confidence: 100,
    color: "sample-blue",
  },
  {
    name: "Campaign export",
    type: "PNG · 8.2 MB",
    status: "Valid with edits",
    confidence: 86,
    color: "sample-orange",
  },
  {
    name: "Social repost",
    type: "WEBP · 2.7 MB",
    status: "No credential",
    confidence: 0,
    color: "sample-dark",
  },
];

const demoReportId = (index: number) =>
  ["northstar-editorial", "campaign-export", "social-repost"][index];

function usePointerGlow(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [ref]);
}

export function VerityExperience() {
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSample, setActiveSample] = useState(0);
  const [activeTool, setActiveTool] = useState<
    "inspect" | "layers" | "timeline"
  >("inspect");
  usePointerGlow(hero);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 900px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduce) return;

          gsap.from("[data-hero-line]", {
            yPercent: 115,
            duration: 1.05,
            stagger: 0.09,
            ease: "power4.out",
            delay: 1.75,
          });

          gsap.to("[data-scan-frame]", {
            yPercent: -8,
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });

          gsap.to("[data-artifact]", {
            yPercent: 14,
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.utils
            .toArray<HTMLElement>("[data-reveal]")
            .forEach((element) => {
              gsap.from(element, {
                y: 72,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 86%" },
              });
            });

          gsap.utils
            .toArray<HTMLElement>("[data-trace-row]")
            .forEach((row, index) => {
              gsap.from(row, {
                opacity: 0.18,
                x: index % 2 === 0 ? -24 : 24,
                scrollTrigger: {
                  trigger: row,
                  start: "top 78%",
                  end: "top 45%",
                  scrub: true,
                },
              });
            });
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  const sample = samples[activeSample];

  return (
    <main ref={root}>
      <SiteLoader />

      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Verity home">
          <span className="brand__mark">V</span>
          <span>VERITY</span>
        </a>
        <nav className="nav__links" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#verify">Verify</a>
          <a href="#workspace">For teams</a>
        </nav>
        <Link className="nav__cta" href="/verify">
          Verify an asset <ArrowUpRight size={15} />
        </Link>
        <button
          className="nav__menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <div id="landing-mobile-menu" className="mobile-menu">
            <a href="#how" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <Link href="/verify" onClick={() => setMenuOpen(false)}>
              Verify
            </Link>
            <Link href="/workspace" onClick={() => setMenuOpen(false)}>
              For teams
            </Link>
          </div>
        )}
      </header>

      <section id="top" className="hero" data-hero ref={hero}>
        <div className="hero__noise" />
        <div className="hero__eyebrow shell">
          <span>
            <i /> Digital evidence infrastructure
          </span>
          <span>
            Scroll to inspect <ArrowDown size={13} />
          </span>
        </div>
        <div className="hero__copy shell">
          <h1 aria-label="See the story behind every file">
            <span className="line">
              <span data-hero-line>See the story</span>
            </span>
            <span className="line line--offset">
              <span data-hero-line>behind every file.</span>
            </span>
          </h1>
          <p>
            Inspect content credentials, trace edit history, and understand
            where digital media comes from.
          </p>
          <div className="hero__actions">
            <Link href="/verify">
              Verify an asset <ArrowUpRight />
            </Link>
            <a href="#how">
              Follow the evidence <ArrowDown />
            </a>
          </div>
        </div>

        <div className="forensic-lens" aria-hidden="true">
          <span>AUTHENTICITY / ORIGIN / EDITS</span>
        </div>

        <div className="artifact-wrap" data-artifact>
          <EvidenceArtwork />
          <div className="artifact__top artifact__top--canvas">
            <span>ASSET / 8F42—A91C</span>
            <span>2048 × 1365</span>
          </div>
          <div className="artifact__status artifact__status--canvas">
            <ShieldCheck size={15} />
            <span>
              <b>Credential verified</b>Signed by Northstar News
            </span>
          </div>
          <div className="data-label data-label--left">
            <span>01</span>
            <p>
              Capture device
              <br />
              <b>Leica SL3</b>
            </p>
          </div>
          <div className="data-label data-label--right">
            <span>02</span>
            <p>
              Active manifest
              <br />
              <b>Signature valid</b>
            </p>
          </div>
        </div>

        <div className="hero__footer shell">
          <p>Built on the open C2PA standard</p>
          <div>
            <span>TRACE</span>
            <span>COMPARE</span>
            <span>VERIFY</span>
          </div>
        </div>
      </section>

      <ManifestSection />

      <section id="verify" className="verify section">
        <div className="shell">
          <div className="section-heading section-heading--light" data-reveal>
            <p className="kicker">02 / Inspect the evidence</p>
            <h2>
              Don&apos;t take our word for it.
              <br />
              <em>Look closer.</em>
            </h2>
          </div>

          <div className="verify-console" data-reveal>
            <div className="verify-console__sidebar">
              <div className="console-title">
                <FileSearch size={17} />
                <span>SAMPLE EVIDENCE</span>
              </div>
              {samples.map((item, index) => (
                <button
                  key={item.name}
                  className={index === activeSample ? "is-active" : ""}
                  onClick={() => setActiveSample(index)}
                >
                  <span className={`sample-thumb ${item.color}`}>
                    <ScanLine size={18} />
                  </span>
                  <span>
                    <b>{item.name}</b>
                    <small>{item.type}</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              ))}
              <Link className="upload-button" href="/verify">
                <Upload size={16} /> Upload your own file
              </Link>
            </div>

            <div className="verify-console__viewer">
              <div
                className={`viewer-media ${sample.color} viewer-media--${activeTool}`}
              >
                <div className="viewer-grid" />
                <div className="viewer-scan" />
                <div className="viewer-object">
                  <div />
                  <span />
                </div>
                <div className="viewer-coordinates">
                  <span>42.3601° N</span>
                  <span>71.0589° W</span>
                </div>
                {activeTool !== "inspect" && (
                  <div className="viewer-overlay">
                    <span>
                      {activeTool === "layers"
                        ? "03 CREDENTIAL LAYERS"
                        : "04 RECORDED EVENTS"}
                    </span>
                    <b>
                      {activeTool === "layers"
                        ? "Source · Edit · Publish"
                        : "Capture → Adjust → Sign → Verify"}
                    </b>
                  </div>
                )}
              </div>
              <div className="viewer-tools">
                <button
                  className={activeTool === "inspect" ? "is-selected" : ""}
                  aria-pressed={activeTool === "inspect"}
                  onClick={() => setActiveTool("inspect")}
                >
                  <ScanLine size={14} /> Inspect
                </button>
                <button
                  className={activeTool === "layers" ? "is-selected" : ""}
                  aria-pressed={activeTool === "layers"}
                  onClick={() => setActiveTool("layers")}
                >
                  <Layers3 size={14} /> Layers
                </button>
                <button
                  className={activeTool === "timeline" ? "is-selected" : ""}
                  aria-pressed={activeTool === "timeline"}
                  onClick={() => setActiveTool("timeline")}
                >
                  <Clock3 size={14} /> Timeline
                </button>
              </div>
            </div>

            <aside className="verify-console__result">
              <p className="result-label">VERIFICATION RESULT</p>
              <div className={`result-seal result-seal--${activeSample}`}>
                <ShieldCheck size={30} />
                <span>
                  {sample.confidence || "—"}
                  <small>{sample.confidence ? "%" : ""}</small>
                </span>
              </div>
              <h3>{sample.status}</h3>
              <p>
                {activeSample === 0
                  ? "The credential is valid and its complete history is available."
                  : activeSample === 1
                    ? "The credential is valid. Declared edits were found in its history."
                    : "No Content Credential was found. This does not mean the asset is false."}
              </p>
              <dl>
                <div>
                  <dt>Signer</dt>
                  <dd>{activeSample === 2 ? "Unknown" : "Northstar News"}</dd>
                </div>
                <div>
                  <dt>Signature</dt>
                  <dd>{activeSample === 2 ? "Not found" : "Valid"}</dd>
                </div>
                <div>
                  <dt>Ingredients</dt>
                  <dd>
                    {activeSample === 0 ? "3" : activeSample === 1 ? "5" : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Last update</dt>
                  <dd>{activeSample === 2 ? "—" : "24 min ago"}</dd>
                </div>
              </dl>
              <Link
                className="report-button"
                href={`/report/${demoReportId(activeSample)}`}
              >
                Open full report <ArrowUpRight size={15} />
              </Link>
            </aside>
          </div>
          <p className="verify-note">
            <Sparkles size={14} /> No upload needed — choose a sample to explore
            a real verification flow.
          </p>
        </div>
      </section>

      <WorkspacePreview />

      <ClosingSection />
    </main>
  );
}
