"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";
import { useLocation } from "@/context/LocationContext";

export default function Order() {
  const { activeId, setLocation } = useLocation();
  const [swapping, setSwapping] = useState(false);
  const id = activeId || LOCATION_IDS[0];

  function pick(nextId) {
    if (nextId === id) return;
    setSwapping(true);
    window.setTimeout(() => setSwapping(false), 180);
    setLocation(nextId);
  }

  return (
    <section className="order" id="order">
      <Reveal as="div" className="order__head">
        <h2>Take-out &amp; delivery, placed online</h2>
      </Reveal>

      <Reveal className="order-tabs" role="tablist" aria-label="Choose a location">
        {LOCATION_IDS.map((locId) => (
          <button
            key={locId}
            className={"order-tab" + (locId === id ? " is-active" : "")}
            role="tab"
            aria-selected={locId === id}
            onClick={() => pick(locId)}
          >
            {LOCATIONS[locId].label}
          </button>
        ))}
      </Reveal>

      <Reveal className={"order__links" + (swapping ? " is-swapping" : "")}>
        {(LOCATIONS[id].orderLinks || []).map((link) => (
          <a key={link.href} className="btn btn--solid" href={link.href} target="_blank" rel="noopener">
            {link.label}
          </a>
        ))}
      </Reveal>
    </section>
  );
}
