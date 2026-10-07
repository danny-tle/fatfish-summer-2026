"use client";
import { useEffect, useRef, useState } from "react";

// on-page helpers the panel switches on. each one only listens while it's mounted.

// follow the pointer, or the focused element for keyboard users. starts mid-screen.
function useFollowY(ref) {
  useEffect(() => {
    function move(y) {
      if (ref.current) ref.current.style.transform = `translateY(${Math.round(y)}px)`;
    }
    function onPointer(e) {
      move(e.clientY);
    }
    function onFocus(e) {
      if (e.target.closest?.("dialog")) return;
      const r = e.target.getBoundingClientRect?.();
      if (r) move(r.top + r.height / 2);
    }
    move(window.innerHeight / 2);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("focusin", onFocus);
    };
  }, [ref]);
}

// a band that marks the line you're reading
export function ReadingLine() {
  const ref = useRef(null);
  useFollowY(ref);
  return <div className="a11y-line" ref={ref} aria-hidden="true" />;
}

// dims everything except a window around the line you're reading
export function ReadingMask() {
  const ref = useRef(null);
  useFollowY(ref);
  return <div className="a11y-mask" ref={ref} aria-hidden="true" />;
}

// shows an element's accessible name (aria-label / title / alt) as a visible tooltip.
// screen readers already get these names, so the tooltip itself is hidden from them.
const LABELLED = 'a[aria-label], button[aria-label], [title], img[alt]:not([alt=""])';

export function Tooltips() {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    function show(e) {
      const el = e.target.closest?.(LABELLED);
      if (!el || el.closest("dialog")) return setTip(null);
      const text = el.getAttribute("aria-label") || el.getAttribute("title") || el.getAttribute("alt");
      const r = el.getBoundingClientRect();
      const below = r.bottom + 60 < window.innerHeight;
      const x = Math.min(Math.max(r.left + r.width / 2, 120), window.innerWidth - 120);
      setTip({ text, x, y: below ? r.bottom + 8 : r.top - 8, below });
    }
    function hide() {
      setTip(null);
    }
    document.addEventListener("pointerover", show);
    document.addEventListener("focusin", show);
    document.addEventListener("focusout", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("pointerover", show);
      document.removeEventListener("focusin", show);
      document.removeEventListener("focusout", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  if (!tip) return null;
  return (
    <div
      className={"a11y-tip" + (tip.below ? "" : " is-above")}
      style={{ left: tip.x, top: tip.y }}
      aria-hidden="true"
    >
      {tip.text}
    </div>
  );
}

// read aloud whatever the visitor clicks or tabs to, using the browser's own speech
const READABLE = "h1, h2, h3, p, li, dt, dd, blockquote, figcaption, label, a, button, img[alt]";

export function PageReader() {
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    let current = null;

    function say(text, el) {
      synth.cancel();
      current?.classList.remove("is-reading");
      current = el;
      el?.classList.add("is-reading");
      const u = new SpeechSynthesisUtterance(text.slice(0, 1500));
      u.lang = "en-US";
      u.onend = () => el?.classList.remove("is-reading");
      synth.speak(u);
    }

    function pick(e) {
      if (e.target.closest?.("dialog")) return;
      const el = e.target.closest?.(READABLE);
      if (!el) return;
      const text = (el.matches("img") ? el.alt : el.innerText || el.getAttribute("aria-label") || "").trim();
      if (text) say(text, el);
    }

    say("Read page is on. Select any text to hear it.");
    document.addEventListener("click", pick);
    document.addEventListener("focusin", pick);
    return () => {
      document.removeEventListener("click", pick);
      document.removeEventListener("focusin", pick);
      synth.cancel();
      current?.classList.remove("is-reading");
    };
  }, []);
  return null;
}

// svg colour matrices the color filters point at (filter: url(#a11y-protan) etc.).
// daltonize-style corrections: shift the colours a visitor can't tell apart into ones they can.
export function ColorFilterDefs() {
  return (
    <svg className="a11y-defs" aria-hidden="true" focusable="false">
      <filter id="a11y-protan" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0.479 0.477 0.044 0 0  0.597 -0.689 1.091 0 0  0 0 0 1 0" />
      </filter>
      <filter id="a11y-deutan" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0.163 0.725 0.112 0 0  0.455 -0.645 1.191 0 0  0 0 0 1 0" />
      </filter>
      <filter id="a11y-tritan" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.741 -0.407 0.666 0 0  0.075 0.585 0.34 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
  );
}
