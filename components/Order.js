"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";
import { useLocation } from "@/context/LocationContext";
import { useAnchoredSwap } from "@/hooks/useAnchoredSwap";
import { onTabListKeyDown } from "@/lib/tabKeys";

export default function Order() {
  const { activeId, setLocation } = useLocation();
  const { anchorRef, remember } = useAnchoredSwap(activeId);
  const [swapping, setSwapping] = useState(false);
  const id = activeId || LOCATION_IDS[0];

  function pick(nextId) {
    if (nextId === id) return;
    remember(); // the menu above changes length — hold this section still
    setSwapping(true);
    window.setTimeout(() => setSwapping(false), 180);
    setLocation(nextId);
  }

  return (
    <section className="order" id="order" ref={anchorRef}>
      <Reveal as="div" className="order__head">
        <h2>Take-Out &amp; Delivery, Placed Online</h2>
      </Reveal>

      <Reveal className="order-tabs" role="tablist" aria-label="Choose a location" onKeyDown={onTabListKeyDown}>
        {LOCATION_IDS.map((locId) => {
          const selected = locId === id;
          return (
            <button
              key={locId}
              id={"order-tab-" + locId}
              className={"order-tab" + (selected ? " is-active" : "")}
              role="tab"
              aria-selected={selected}
              aria-controls="order-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(locId)}
            >
              {LOCATIONS[locId].label}
            </button>
          );
        })}
      </Reveal>

      <Reveal
        id="order-panel"
        role="tabpanel"
        aria-labelledby={"order-tab-" + id}
        className={"order__links" + (swapping ? " is-swapping" : "")}
      >
        {(LOCATIONS[id].orderLinks || []).map((link) => (
          <a key={link.href} className="btn btn--outline" href={link.href} target="_blank" rel="noopener">
            {link.label}
          </a>
        ))}
      </Reveal>
    </section>
  );
}
