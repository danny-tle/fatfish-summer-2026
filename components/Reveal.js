"use client";
import { useEffect, useRef, useState } from "react";

// scroll-reveal wrapper: adds .is-visible once the element scrolls into view.
// stagger sets a per-item transition delay (index * 120ms, capped at 4).
export default function Reveal({ as: Tag = "div", stagger, immediate = false, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // immediate skips the observer. bottom-pinned content never trips the
    // -12% bottom inset at scroll 0, so it would otherwise stay hidden.
    if (reduceMotion || immediate) {
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
  }, [immediate]);

  const style = typeof stagger === "number" ? { transitionDelay: Math.min(stagger, 4) * 120 + "ms" } : undefined;

  return (
    <Tag ref={ref} className={"reveal" + (visible ? " is-visible" : "") + (className ? " " + className : "")} style={style} {...rest}>
      {children}
    </Tag>
  );
}
