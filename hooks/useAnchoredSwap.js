"use client";
import { useLayoutEffect, useRef } from "react";

// the two menus are very different lengths, so switching store shifts everything
// below by ~1200px. this keeps the anchor element put. pass activeId as key.
export function useAnchoredSwap(key) {
  const anchorRef = useRef(null);
  const topRef = useRef(null);

  // call this in the click handler, before setLocation()
  function remember() {
    if (anchorRef.current) topRef.current = anchorRef.current.getBoundingClientRect().top;
  }

  useLayoutEffect(() => {
    const el = anchorRef.current;
    if (topRef.current == null || !el) return;
    const delta = el.getBoundingClientRect().top - topRef.current;
    topRef.current = null;
    if (Math.abs(delta) < 1) return;

    // scroll-behavior: smooth would animate the correction, so turn it off here
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollBy(0, delta);
    root.style.scrollBehavior = prev;
  }, [key]);

  return { anchorRef, remember };
}
