"use client";
import { useSyncExternalStore } from "react";
import { getPrefs, getServerPrefs, subscribePrefs } from "@/lib/a11yPrefs";

// subscribes to the reduced-motion setting instead of reading it in an effect,
// so there's no setState on mount and it reacts if the user changes it.
// the accessibility panel's "Stop Animations" counts too.
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReduceMotion() {
  const system = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false // server render: assume motion is fine, the client corrects it
  );
  const still = useSyncExternalStore(subscribePrefs, () => getPrefs().still, () => getServerPrefs().still);
  return system || still;
}
