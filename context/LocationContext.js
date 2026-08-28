"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { LOCATIONS } from "@/lib/locations";

// the react version of script.js's onLocation()/setLocation() pub-sub. every
// section that needs to know "which store is active" reads it from here
// instead of subscribing by hand.
const LocationCtx = createContext(null);

export function LocationProvider({ children }) {
  const [activeId, setActiveId] = useState(null);
  const [fading, setFading] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // story text/photos cross-fade via CSS selectors keyed off this body class
  // (body.loc-fading [data-locimg], same as the vite site) rather than each
  // component tracking its own fade state
  useEffect(() => {
    document.body.classList.toggle("loc-fading", fading);
  }, [fading]);

  function setLocation(id, opts) {
    if (!LOCATIONS[id] || id === activeId) return;
    const animate = !reduceMotion && !(opts && opts.animate === false);
    if (animate) {
      setFading(true);
      window.setTimeout(() => {
        setActiveId(id);
        setFading(false);
      }, 400);
    } else {
      setActiveId(id);
    }
  }

  const value = useMemo(
    () => ({ activeId, location: activeId ? LOCATIONS[activeId] : null, fading, reduceMotion, setLocation }),
    [activeId, fading, reduceMotion]
  );

  return <LocationCtx.Provider value={value}>{children}</LocationCtx.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationCtx);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
