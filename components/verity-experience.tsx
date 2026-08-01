"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  FileSearch,
  Fingerprint,
  Layers3,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { SiteLoader } from "@/components/site-loader";

const EvidenceCanvas = dynamic(
  () =>
    import("@/components/evidence-canvas").then(
      (module) => module.EvidenceCanvas,
    ),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger, useGSAP);

const timeline = [
  {
    id: "01",
    label: "Captured",
    meta: "Leica SL3 · 06:42 UTC",
    detail: "Original capture signed at source",
    tone: "valid",
  },
  {
    id: "02",
    label: "Adjusted",
    meta: "Lightroom · 07:18 UTC",
    detail: "Exposure and color profile changed",
    tone: "edit",
  },
  {
    id: "03",
    label: "Published",
    meta: "Northstar News · 08:03 UTC",
    detail: "Publisher identity cryptographically signed",
    tone: "valid",
  },
  {
    id: "04",
    label: "Verified",
    meta: "Verity · just now",
    detail: "Credential chain intact",
    tone: "valid",
  },
];

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

          gsap.to("[data-orbit]", {
            rotate: 18,
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });

          gsap.to("[data-artifact]", {
            yPercent: 20,
            rotateX: -4,
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

        <div className="forensic-lens">
          <span>TRACE</span>
        </div>

        <div className="artifact-wrap" data-artifact>
          <div className="artifact-orbit" data-orbit>
            <span />
            <span />
            <span />
          </div>
          <Suspense
            fallback={
              <div className="canvas-fallback">
                <ScanLine />
                <span>Preparing evidence object</span>
              </div>
            }
          >
            <EvidenceCanvas />
          </Suspense>
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

      <section id="how" className="manifest section shell">
        <div className="section-heading" data-reveal>
          <p className="kicker">01 / Provenance, made visible</p>
          <h2>
            A file is not a moment.
            <br />
            <em>It is a chain of events.</em>
          </h2>
          <p className="section-intro">
            Verity reads the cryptographically signed history attached to
            digital media and translates it into evidence people can understand.
          </p>
        </div>

        <div className="trace">
          <div className="trace__visual" data-reveal>
            <div className="trace__frame">
              <div className="trace__scene">
                <div className="trace__sun" />
                <div className="trace__hill trace__hill--one" />
                <div className="trace__hill trace__hill--two" />
              </div>
              <span>ACTIVE MANIFEST</span>
            </div>
            <div className="trace__stamp">
              <Fingerprint size={23} />
              <span>SHA-256</span>
              <b>8f42...a91c</b>
            </div>
          </div>
          <div className="trace__list">
            {timeline.map((item) => (
              <article key={item.id} data-trace-row>
                <div className={`trace__dot trace__dot--${item.tone}`}>
                  <span>{item.id}</span>
                </div>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.meta}</p>
                  <small>{item.detail}</small>
                </div>
                <Check size={17} />
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section id="workspace" className="workspace section shell">
        <div className="workspace__copy" data-reveal>
          <p className="kicker">03 / Built for verification teams</p>
          <h2>
            From one file
            <br />
            to every file.
          </h2>
          <p>
            Review high-volume media, preserve an auditable record, and
            integrate provenance checks into the tools your team already uses.
          </p>
          <Link href="/workspace">
            Explore the workspace <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="workspace__ui" data-reveal>
          <div className="workspace__nav">
            <span className="brand__mark">V</span>
            <div>
              <i />
              <i />
              <i />
              <i />
            </div>
            <span>AD</span>
          </div>
          <div className="workspace__body">
            <div className="workspace__header">
              <div>
                <small>WORKSPACE / NORTHSTAR</small>
                <h3>Verification queue</h3>
              </div>
              <Link href="/verify">
                <Upload size={14} /> New verification
              </Link>
            </div>
            <div className="workspace__stats">
              <div>
                <small>VERIFIED ASSETS</small>
                <b>1,284</b>
                <span>+12.8%</span>
              </div>
              <div>
                <small>REQUIRES REVIEW</small>
                <b>24</b>
                <span>6 urgent</span>
              </div>
              <div>
                <small>AVG. PROCESSING</small>
                <b>1.8s</b>
                <span>Live</span>
              </div>
            </div>
            <div className="workspace__table">
              <div className="table-head">
                <span>ASSET</span>
                <span>STATUS</span>
                <span>SOURCE</span>
                <span>UPDATED</span>
              </div>
              {[
                "Northern light.jpg",
                "City archive-04.tif",
                "Interview-final.mp4",
                "Campaign-export.png",
              ].map((name, i) => (
                <div className="table-row" key={name}>
                  <span>
                    <i className={`mini-media mini-media--${i}`} />
                    <b>{name}</b>
                  </span>
                  <span>
                    <i className={i === 3 ? "warn" : "ok"} />
                    {i === 3 ? "Review" : "Verified"}
                  </span>
                  <span>{i % 2 ? "Archive team" : "Northstar News"}</span>
                  <span>{i + 2} min ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="closing__grid" />
        <div className="closing__seal" data-reveal>
          <ShieldCheck />
          <span>
            PROOF
            <br />
            FOUND
          </span>
        </div>
        <div className="closing__copy shell" data-reveal>
          <p className="kicker">The next layer of digital trust</p>
          <h2>
            Don&apos;t guess
            <br />
            what happened.
            <br />
            <em>Trace it.</em>
          </h2>
          <Link href="/verify">
            Verify an asset <ArrowUpRight />
          </Link>
        </div>
        <footer className="shell">
          <div className="brand">
            <span className="brand__mark">V</span>
            <span>VERITY</span>
          </div>
          <p>
            Content provenance infrastructure for a more transparent internet.
          </p>
          <div>
            <Link href="/verify">Verify</Link>
            <a href="https://c2pa.org" target="_blank" rel="noreferrer">
              C2PA
            </a>
            <a
              href="https://github.com/Dpehect/Verity-AI-PHOTO-CHECK-APP"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
          <span>© 2026 VERITY</span>
        </footer>
      </section>
    </main>
  );
}
