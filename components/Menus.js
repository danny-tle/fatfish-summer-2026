"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import MenuSection from "./MenuSection";
import { useLocation } from "@/context/LocationContext";
import { onTabListKeyDown } from "@/lib/tabKeys";

export default function Menus({ locations }) {
  const { activeId, setLocation } = useLocation();
  const [swapping, setSwapping] = useState(false);
  const active = locations.find((l) => l.id === activeId) || locations[0];

  function pick(id) {
    if (id === activeId) return;
    setSwapping(true);
    window.setTimeout(() => setSwapping(false), 180);
    setLocation(id);
  }

  return (
    <section className="menus" id="menus">
      <Reveal as="header" className="menus__head">
        <p className="kicker">Extra sauce, ginger &amp; wasabi — $0.50</p>
        <h2>The Menu</h2>
      </Reveal>

      <Reveal className="menu-tabs" role="tablist" aria-label="Choose a location" onKeyDown={onTabListKeyDown}>
        {locations.map((loc) => {
          const selected = loc.id === active.id;
          return (
            <button
              key={loc.id}
              id={"menu-tab-" + loc.id}
              className={"menu-tab" + (selected ? " is-active" : "")}
              role="tab"
              aria-selected={selected}
              aria-controls="menu-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(loc.id)}
            >
              <span className="menu-tab__name">{loc.label}</span>
              <span className="menu-tab__addr">{loc.address}</span>
            </button>
          );
        })}
      </Reveal>

      <div
        id="menu-panel"
        className={"menu-panel" + (swapping ? " is-swapping" : "")}
        role="tabpanel"
        aria-labelledby={"menu-tab-" + active.id}
      >
        {(active.sections || []).map((section, i) => (
          <MenuSection key={section.title + i} section={section} />
        ))}
      </div>
    </section>
  );
}
