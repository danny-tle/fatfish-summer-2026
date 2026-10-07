"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";

// the opening screen. up from the first paint, fades out once a store is picked.
// a ?location= link (written back by LocationContext) skips it.
export default function SplashPicker() {
  const { setLocation } = useLocation();
  const [open, setOpen] = useState(true);
  const [photoReady, setPhotoReady] = useState(false);
  const rootRef = useRef(null);
  const photoRef = useRef(null);

  // onLoad can fire before hydration if the file is cached, so check .complete too
  useEffect(() => {
    if (photoRef.current?.complete) setPhotoReady(true);
  }, []);

  useEffect(() => {
    // browsers restore scroll position on reload, force back to the top.
    // a #section link is left alone so it lands where it points once the picker closes.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    const onLoad = () => window.scrollTo(0, 0);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // a shared link already names the store, so don't ask again
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("location");
    if (LOCATIONS[id]) choose(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  // while open: lock scroll, take focus, and make the page behind unreachable
  useEffect(() => {
    document.body.classList.toggle("is-picking", open);
    const el = rootRef.current;
    if (!el?.parentElement) return;
    const behind = Array.from(el.parentElement.children).filter(
      (n) => n !== el && n.matches("header, main, footer, .skip-link")
    );
    behind.forEach((n) => (n.inert = open));

    if (open) {
      el.focus();
    } else {
      // focus would otherwise drop to <body> when the picker hides
      const target = document.getElementById(window.location.hash.slice(1)) || document.querySelector("main");
      target?.focus({ preventScroll: true });
      if (window.location.hash) target?.scrollIntoView();
    }
    return () => behind.forEach((n) => (n.inert = false));
  }, [open]);

  function choose(id) {
    setLocation(id, { animate: false }); // set story/menu/images before revealing
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={"picker" + (open ? " is-open" : " is-done")}
      role="dialog"
      aria-modal="true"
      aria-label="Choose a location"
      aria-hidden={!open}
      tabIndex={-1}
    >
      {/* same photo as the hero, so it's one request */}
      <div className={"picker__backdrop" + (photoReady ? " is-ready" : "")} aria-hidden="true">
        <img
          ref={photoRef}
          src="/img/hero.jpg"
          alt=""
          width={2000}
          height={1333}
          fetchPriority="high"
          onLoad={() => setPhotoReady(true)}
        />
      </div>

      <div className="picker__inner">
        {/* a <p>, not a heading: this sits before the page's <h1> in the DOM */}
        <p className="picker__q">Where are we visiting?</p>
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
  );
}
