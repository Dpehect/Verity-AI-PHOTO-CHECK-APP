"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

export function MotionSystem({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const splits: SplitText[] = [];
    const context = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>("[data-split], .app-page h1, .app-page h2")
        .forEach((element) => {
          const split = SplitText.create(element, {
            type: "lines,words",
            linesClass: "motion-line",
            wordsClass: "motion-word",
            mask: "lines",
          });
          splits.push(split);
          gsap.from(split.words, {
            yPercent: 115,
            rotate: 2,
            duration: 0.9,
            stagger: 0.025,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -5 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      const track = document.querySelector<HTMLElement>("[data-drag-track]");
      if (track && track.parentElement) {
        const max = () =>
          Math.min(0, track.parentElement!.clientWidth - track.scrollWidth);
        Draggable.create(track, {
          type: "x",
          bounds: { minX: max(), maxX: 0 },
          inertia: false,
          edgeResistance: 0.85,
          cursor: "grab",
          activeCursor: "grabbing",
        });
      }
    }, root);
    ScrollTrigger.refresh();
    return () => {
      splits.forEach((split) => split.revert());
      context.revert();
    };
  }, [pathname]);

  useEffect(() => {
    const curtain = document.querySelector<HTMLElement>(".route-curtain");
    if (curtain)
      gsap.to(curtain, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.72,
        ease: "power4.inOut",
      });
  }, [pathname]);

  useEffect(() => {
    const rootElement = root.current;
    if (!rootElement) return;
    const click = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        !anchor ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        anchor.target === "_blank"
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== location.origin ||
        url.pathname === location.pathname ||
        url.hash
      )
        return;
      event.preventDefault();
      const curtain = document.querySelector<HTMLElement>(".route-curtain");
      if (!curtain) return router.push(url.pathname + url.search);
      gsap.set(curtain, { scaleY: 0, transformOrigin: "bottom" });
      gsap.to(curtain, {
        scaleY: 1,
        duration: 0.58,
        ease: "power4.inOut",
        onComplete: () => router.push(url.pathname + url.search),
      });
    };
    rootElement.addEventListener("click", click);
    return () => rootElement.removeEventListener("click", click);
  }, [router]);

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".motion-cursor");
    if (!cursor || matchMedia("(pointer: coarse)").matches) return;
    const x = gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3" });
    const move = (event: PointerEvent) => {
      x(event.clientX);
      y(event.clientY);
    };
    const over = (event: PointerEvent) =>
      cursor.classList.toggle(
        "is-active",
        !!(event.target as HTMLElement).closest("a,button,[data-drag-track]"),
      );
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div ref={root}>
      {children}
      <div className="route-curtain" aria-hidden="true" />
      <div className="motion-cursor" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
