"use client";
import { useEffect, useRef, useState } from "react";

// react version of script.js's scroll-reveal: the vanilla site rolled its own
// scroll-position check instead of IntersectionObserver (a note in the source
// said IO didn't fire in some headless/preview renderer they'd used) — in a
// real browser IO is the standard tool for exactly this, so that's what this
// uses. stagger mirrors the original's per-item delay for the "thirds" gallery
// row (index * 120ms, capped at 4 steps) — everything else lets the
// stylesheet's own per-element transition-delay (hero title lines, etc) apply.
export default function Reveal({ as: Tag = "div", stagger, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" } // roughly the original's 88%-down-viewport trigger
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style = typeof stagger === "number" ? { transitionDelay: Math.min(stagger, 4) * 120 + "ms" } : undefined;

  return (
    <Tag ref={ref} className={"reveal" + (visible ? " is-visible" : "") + (className ? " " + className : "")} style={style} {...rest}>
      {children}
    </Tag>
  );
}
