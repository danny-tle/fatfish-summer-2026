"use client";
import { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";

export default function SplashPicker() {
  const { setLocation, reduceMotion } = useLocation();
  const [phase, setPhase] = useState("splash"); // splash | picking | done

  useEffect(() => {
    // browsers remember scroll position across reloads — the splash should
    // always lead, so force back to the top on first load.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    window.addEventListener("load", () => window.scrollTo(0, 0));

    const t = window.setTimeout(() => setPhase("picking"), reduceMotion ? 200 : 2200);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    document.body.classList.toggle("is-splashing", phase === "splash");
    document.body.classList.toggle("is-picking", phase === "picking");
  }, [phase]);

  function choose(id) {
    setLocation(id, { animate: false }); // set story/menu/images before revealing
    setPhase("done");
  }

  return (
    <>
      <div className={"splash" + (phase !== "splash" ? " is-done" : "")} aria-hidden="true">
        <p className="splash__line">
          <span className="splash__brand">Fat&nbsp;Fish</span>
          <span className="splash__dash">—</span>
          <span className="splash__tag">Inventive Sushi &amp; Pho</span>
        </p>
      </div>

      <div
        className={"picker" + (phase === "picking" ? " is-open" : "") + (phase === "done" ? " is-done" : "")}
        role="dialog"
        aria-label="Choose a location"
        aria-hidden={phase !== "picking"}
      >
        <div className="picker__inner">
          <p className="picker__eyebrow">Two locations, one Fat Fish</p>
          <h2 className="picker__q">Where are we visiting?</h2>
          <div className="picker__opts">
            {LOCATION_IDS.map((id) => (
              <button key={id} className="picker__opt" onClick={() => choose(id)}>
                <span className="picker__name">{LOCATIONS[id].label}</span>
                <span className="picker__addr">{LOCATIONS[id].address}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
