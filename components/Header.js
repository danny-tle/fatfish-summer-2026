"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";

export default function Header() {
  const { activeId } = useLocation();
  // fall back to the first store if nothing is picked yet
  const here = LOCATIONS[activeId || LOCATION_IDS[0]];
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      setStuck(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // escape closes the mobile menu and hands focus back to the toggle
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={"bar" + (stuck ? " is-stuck" : "") + (open ? " is-open" : "")}>
      <a className="bar__brand" href="#top" aria-label="Fat Fish home">
        <span className="bar__name">FAT&nbsp;FISH</span>
      </a>

      <nav className="bar__nav" id="primary-nav" aria-label="Primary">
        <a href="#order" onClick={() => setOpen(false)}>Takeout</a>
        <a href="#menus" onClick={() => setOpen(false)}>Menus</a>
        <a href="#story" onClick={() => setOpen(false)}>Our Story</a>
        <a href="#locations" onClick={() => setOpen(false)}>Locations</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        <a
          href={here.directions}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Directions
        </a>
      </nav>

      <div className="bar__actions">
        <a className="btn btn--ghost" href="#order">Order Online</a>
        {/* same target as the button beside it, so keep it out of the tab order and the a11y tree */}
        <a className="bar__logo" href="#order" tabIndex={-1} aria-hidden="true">
          <img src="/img/logo.webp" alt="" width={315} height={209} />
        </a>
        <button
          ref={toggleRef}
          className="bar__menuToggle"
          aria-label="Menu"
          aria-controls="primary-nav"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span><span></span>
        </button>
      </div>
    </header>
  );
}
