"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";

// the opening screen. up from the first paint, fades out once a store is picked.
export default function SplashPicker() {
  const { setLocation } = useLocation();
  const [open, setOpen] = useState(true);
  const [photoReady, setPhotoReady] = useState(false);
  const photoRef = useRef(null);

  // onLoad can fire before hydration if the file is cached, so check .complete too
  useEffect(() => {
    if (photoRef.current?.complete) setPhotoReady(true);
  }, []);

  useEffect(() => {
    // browsers restore scroll position on reload, force back to the top
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const onLoad = () => window.scrollTo(0, 0);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-picking", open);
  }, [open]);

  function choose(id) {
    setLocation(id, { animate: false }); // set story/menu/images before revealing
    setOpen(false);
  }

  return (
    <div
      className={"picker" + (open ? " is-open" : " is-done")}
      role="dialog"
      aria-label="Choose a location"
      aria-hidden={!open}
    >
      {/* same photo as the hero, so it's one request */}
      <div className={"picker__backdrop" + (photoReady ? " is-ready" : "")} aria-hidden="true">
        <img
          ref={photoRef}
          src="/img/hero.jpg"
          alt=""
          fetchPriority="high"
          onLoad={() => setPhotoReady(true)}
        />
      </div>

      <div className="picker__inner">
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
  );
}
