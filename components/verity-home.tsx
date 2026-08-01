"use client";

import Link from "next/link";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

const signals = [
  {
    number: "01",
    title: "SOURCE\nIDENTITY",
    detail: "Find who signed the asset and where its provenance record begins.",
    tone: "mint",
  },
  {
    number: "02",
    title: "EDIT\nHISTORY",
    detail: "Read the declared changes between capture and publication.",
    tone: "acid",
  },
  {
    number: "03",
    title: "SIGNATURE\nCHAIN",
    detail: "Check whether every cryptographic link remains intact.",
    tone: "ice",
  },
  {
    number: "04",
    title: "FILE\nFINGERPRINT",
    detail: "Create a local SHA-256 fingerprint for an exact file reference.",
    tone: "paper",
  },
];

export function VerityHome() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set("[data-signal-card]", { opacity: 1 });
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-signal-card]");
      const compact = window.innerWidth < 800;
      const rotations = compact ? [-7, -2, 2, 7] : [-8, -3, 3, 8];
      const xPositions = compact ? [-120, -40, 40, 120] : [-285, -95, 95, 285];
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-story]",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
        },
      });

      timeline
        .to("[data-title-line='one']", {
          duration: 1.35,
          scrambleText: {
            text: "Four signals today.",
            chars: "VERITY0123456789—+",
            speed: 0.38,
          },
          ease: "none",
        })
        .to(
          "[data-title-line='two']",
          {
            duration: 1.35,
            scrambleText: {
              text: "One clearer story.",
              chars: "VERITY0123456789—+",
              speed: 0.38,
            },
            ease: "none",
          },
          "<",
        )
        .to({}, { duration: 0.55 })
        .to("[data-story-title]", {
          scale: 0.68,
          yPercent: -86,
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
        });

      cards.forEach((card, index) => {
        timeline.fromTo(
          card,
          { opacity: 0, y: 560, x: 0, rotate: 0, scale: 0.8 },
          {
            opacity: 1,
            y: 35,
            x: xPositions[index],
            rotate: rotations[index],
            scale: 1,
            duration: 0.82,
            ease: "power3.out",
          },
          index === 0 ? "-=0.28" : "-=0.12",
        );
      });

      timeline
        .to({}, { duration: 0.35 })
        .to(cards, {
          y: -105,
          x: (index) => xPositions[index] * 1.08,
          rotate: (index) => rotations[index] * 0.82,
          duration: 0.75,
          ease: "power2.inOut",
        })
        .to("[data-next-note]", { opacity: 1, y: 0, duration: 0.35 }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <main ref={root} className="new-home">
      <header className="new-home-nav">
        <Link className="new-home-brand" href="/" aria-label="Verity home">
          VERITY<span>®</span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#method">
            METHOD <small>04</small>
          </a>
          <Link href="/workspace">WORKSPACE</Link>
          <a href="https://c2pa.org" target="_blank" rel="noreferrer">
            C2PA
          </a>
        </nav>
        <Link
          className="new-home-index"
          href="/workspace"
          aria-label="Open workspace"
        >
          <CircleDot size={15} />
        </Link>
        <Link className="new-home-verify" href="/verify">
          VERIFY <ArrowUpRight size={14} />
        </Link>
      </header>

      <section id="method" className="signal-story" data-story>
        <div className="signal-story__stage">
          <div className="signal-story__meta">
            <span>DIGITAL PROVENANCE / 2026</span>
            <span>SCROLL TO RESOLVE</span>
          </div>
          <div className="signal-story__copy">
            <h1
              data-story-title
              aria-label="Four signals today. One clearer story."
            >
              <span data-title-line="one">4 sgnls tdy.</span>
              <span data-title-line="two">1 clr stry.</span>
            </h1>
          </div>
          <div className="signal-deck" aria-label="Four verification signals">
            {signals.map((signal) => (
              <article
                key={signal.number}
                className={`signal-card signal-card--${signal.tone}`}
                data-signal-card
              >
                <div className="signal-card__top">
                  <span>VERITY SIGNAL</span>
                  <span>{signal.number}</span>
                </div>
                <h2>
                  {signal.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <b>{signal.number}</b>
                <p>{signal.detail}</p>
                <i />
              </article>
            ))}
          </div>
          <div className="signal-story__counter">
            <span>ON SCREEN</span>
            <i />
            <b>001</b>
          </div>
          <p className="signal-story__next" data-next-note>
            Continue to verify a file
          </p>
        </div>
      </section>
    </main>
  );
}
