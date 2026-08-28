"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setStuck(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"bar" + (stuck ? " is-stuck" : "") + (open ? " is-open" : "")}>
      <a className="bar__brand" href="#top" aria-label="Fat Fish home">
        <span className="bar__name">FAT&nbsp;FISH</span>
      </a>

      <nav className="bar__nav" aria-label="Primary">
        <a href="#menus" onClick={() => setOpen(false)}>Menus</a>
        <a href="#story" onClick={() => setOpen(false)}>Our Story</a>
        <a href="#locations" onClick={() => setOpen(false)}>Locations</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
      </nav>

      <div className="bar__actions">
        <a className="btn btn--ghost" href="#order">Order Online</a>
        <a className="bar__logo" href="#order" aria-label="Order online">
          <img src="/img/logo.png" alt="" />
        </a>
        <button
          className="bar__menuToggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span><span></span>
        </button>
      </div>
    </header>
  );
}
