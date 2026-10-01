"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { LOCATIONS } from "@/lib/locations";
import { useReduceMotion } from "@/hooks/useReduceMotion";

// holds which store is active. every section that cares reads it from here.
const LocationCtx = createContext(null);

export function LocationProvider({ children }) {
  const [activeId, setActiveId] = useState(null);
  const [fading, setFading] = useState(false);
  const reduceMotion = useReduceMotion();

  // this body class drives the CSS cross-fade for the story text and photos
  useEffect(() => {
    document.body.classList.toggle("loc-fading", fading);
  }, [fading]);

  const setLocation = useCallback(
    (id, opts) => {
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
    },
    [activeId, reduceMotion]
  );

  const value = useMemo(
    () => ({ activeId, location: activeId ? LOCATIONS[activeId] : null, fading, reduceMotion, setLocation }),
    [activeId, fading, reduceMotion, setLocation]
  );

  return <LocationCtx.Provider value={value}>{children}</LocationCtx.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationCtx);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
