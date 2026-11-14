"use client";

import { useEffect } from "react";

/** Motion stays outside React's render loop and follows device preferences live. */
export default function Motion({ revision }: { revision: string }) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const root = document.documentElement;
    let dispose = () => {};

    function configure() {
      dispose();
      if (preference.matches) return;

      const reveals = document.querySelectorAll<HTMLElement>(".timeline-intro > *, .timeline-item");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add("revealed");
            observer.unobserve(target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
      reveals.forEach((element, index) => {
        element.classList.add("reveal");
        element.style.setProperty("--reveal-delay", `${(index % 2) * 65}ms`);
        observer.observe(element);
      });

      const magnets = [...document.querySelectorAll<HTMLElement>("nav a, .timeline-step")];
      let frame = 0;
      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      let pointerActive = false;
      let activeMagnet: HTMLElement | null = null;

      function paint() {
        frame = 0;
        if (finePointer.matches && pointerActive) {
          root.style.setProperty("--cursor-x", `${pointerX}px`);
          root.style.setProperty("--cursor-y", `${pointerY}px`);
          root.classList.add("pointer-lit");
          const next = magnets.find((element) => {
            const bounds = element.getBoundingClientRect();
            return pointerX >= bounds.left - 14 && pointerX <= bounds.right + 14 && pointerY >= bounds.top - 14 && pointerY <= bounds.bottom + 14;
          }) ?? null;
          if (activeMagnet !== next) activeMagnet?.style.removeProperty("translate");
          activeMagnet = next;
          if (next) {
            const bounds = next.getBoundingClientRect();
            next.style.translate = `${(pointerX - bounds.left - bounds.width / 2) * 0.16}px ${(pointerY - bounds.top - bounds.height / 2) * 0.2}px`;
          }
        }
      }
      function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
      function move(event: PointerEvent) {
        if (event.pointerType === "touch") return;
        pointerActive = true;
        pointerX = event.clientX;
        pointerY = event.clientY;
        schedule();
      }
      function leave() {
        pointerActive = false;
        root.classList.remove("pointer-lit");
        activeMagnet?.style.removeProperty("translate");
        activeMagnet = null;
      }
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", leave);
      window.addEventListener("blur", leave);
      schedule();
      dispose = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", leave);
        window.removeEventListener("blur", leave);
        leave();
        reveals.forEach((element) => element.classList.remove("reveal", "revealed"));
      };
    }
    configure();
    preference.addEventListener("change", configure);
    finePointer.addEventListener("change", configure);
    return () => {
      dispose();
      preference.removeEventListener("change", configure);
      finePointer.removeEventListener("change", configure);
    };
  }, [revision]);

  return <div className="cursor-light" aria-hidden="true" />;
}
