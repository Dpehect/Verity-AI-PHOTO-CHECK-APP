"use client";

import Link from "next/link";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

function CharacterLine({
  text,
  line,
  group = "hero",
}: {
  text: string;
  line: number;
  group?: "hero" | "trust";
}) {
  return (
    <span className="signal-title-line" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span
          className="signal-title-char"
          aria-hidden="true"
          key={`${character}-${index}`}
        >
          <span
            data-character-group={group}
            data-index={index}
            data-line={line}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        </span>
      ))}
    </span>
  );
}

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
      const characters = gsap.utils.toArray<HTMLElement>(
        "[data-character-group='hero']",
      );
      const rotations = [0, 6.2, 12.4, 18.6];
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-story]",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.35,
        },
      });

      gsap.set(characters, {
        x: (index, element) => {
          const line = Number((element as HTMLElement).dataset.line ?? 0);
          return (((index * 47 + line * 31) % 181) - 90) * 3.4;
        },
        y: (index, element) => {
          const line = Number((element as HTMLElement).dataset.line ?? 0);
          return (((index * 83 + line * 19) % 151) - 75) * 2.2;
        },
        rotate: (index) => ((index * 37) % 110) - 55,
        scale: 0.8,
        opacity: (index) => (index % 4 === 0 || index % 7 === 0 ? 0.78 : 0),
      });

      timeline
        .to("[data-initial-message]", { opacity: 0, duration: 0.3 })
        .to(
          characters,
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 1.3,
            stagger: { each: 0.028, from: "random" },
            ease: "power3.out",
          },
          "<0.05",
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
          {
            opacity: 1,
            yPercent: 135,
            rotate: rotations[index],
            scale: 1,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotate: rotations[index],
            scale: 1,
            duration: 1.05,
            ease: "power2.inOut",
          },
          index === 0 ? "-=0.08" : ">",
        );
      });

      timeline
        .to({}, { duration: 0.6 })
        .to("[data-next-note]", { opacity: 1, y: 0, duration: 0.35 }, "-=0.2");

      const trustCharacters = gsap.utils.toArray<HTMLElement>(
        "[data-character-group='trust']",
      );
      gsap.set(trustCharacters, {
        x: (index) => (((index * 61) % 241) - 120) * 4.2,
        y: (index) => (((index * 97) % 181) - 90) * 3.2,
        rotate: (index) => ((index * 43) % 130) - 65,
        scale: (index) => 0.72 + (index % 4) * 0.1,
        opacity: (index) => (index % 3 === 0 ? 1 : 0.12),
      });

      const trustTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-trust-story]",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
      trustTimeline
        .to(trustCharacters, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 1.8,
          stagger: { each: 0.035, from: "random" },
          ease: "power3.out",
        })
        .to({}, { duration: 0.6 })
        .to("[data-trust-question]", {
          xPercent: -135,
          scale: 1.16,
          duration: 1.65,
          ease: "power2.inOut",
        })
        .fromTo(
          "[data-trust-cta]",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.42",
        );
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
            <p className="signal-story__initial" data-initial-message>
              <span>4 checks ready.</span>
              <span>1 story waiting.</span>
            </p>
            <h1
              data-story-title
              aria-label="Four signals today. One clearer story."
            >
              <CharacterLine text="Four signals today." line={0} />
              <CharacterLine text="One clearer story." line={1} />
            </h1>
          </div>
          <div
            className="signal-deck signal-circles"
            data-card-fan
            aria-label="Four verification signals"
          >
            {signals.map((signal) => (
              <article
                key={signal.number}
                className={`signal-card signal-circle signal-card--${signal.tone}`}
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

      <section className="trust-story" data-trust-story>
        <div className="trust-story__stage">
          <div className="trust-story__question" data-trust-question>
            <h2 aria-label="So, can you trust this file?">
              <CharacterLine
                text="So, can you trust this file?"
                line={0}
                group="trust"
              />
            </h2>
          </div>
          <div className="trust-story__cta" data-trust-cta>
            <p>
              <i /> VERIFY WHAT YOU SEE
            </p>
            <h3>
              Read the full
              <span>evidence record</span>
            </h3>
            <Link href="/verify">
              Start a verification <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="trust-story__counter">
            <span>ON SCREEN</span>
            <i />
            <b>002</b>
          </div>
        </div>
      </section>
    </main>
  );
}
