"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEVELS, getPrefs, getServerPrefs, resetPrefs, setPrefs, subscribePrefs } from "@/lib/a11yPrefs";

// 24px stroke icons, drawn in currentColor
const ICONS = {
  text: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></>,
  lineHeight: <><path d="M4 6l2-2 2 2M4 18l2 2 2-2M6 4v16M12 6h8M12 12h8M12 18h8" /></>,
  spacing: <><path d="M7 8l-4 4 4 4M17 8l4 4-4 4M9 12h1M12 12h0M14 12h1" /></>,
  readable: <><path d="M4 19l5-14 5 14M6 14h6M17 19v-6a2.5 2.5 0 1 1 3 0v6" /></>,
  still: <><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></>,
  cursor: <><path d="M5 3l14 7-6 2-2 6z" /></>,
  contrast: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" /></>,
  grayscale: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></>,
  hideImages: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 16l5-5 4 4 3-3 6 6M3 3l18 18" /></>,
  links: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  guide: <><path d="M3 12h18" strokeWidth="3" /><path d="M3 6h18M3 18h18" opacity=".4" /></>,
};

const GROUPS = [
  {
    title: "Content",
    tiles: [
      ["text", "Bigger Text"],
      ["lineHeight", "Line Height"],
      ["spacing", "Text Spacing"],
      ["readable", "Readable Font"],
      ["still", "Stop Animations"],
      ["cursor", "Bigger Cursor"],
    ],
  },
  {
    title: "Color",
    tiles: [
      ["contrast", "High Contrast"],
      ["grayscale", "Grayscale"],
      ["hideImages", "Hide Images"],
    ],
  },
  {
    title: "Navigation",
    tiles: [
      ["links", "Highlight Links"],
      ["guide", "Reading Guide"],
    ],
  },
];

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

function Tile({ id, label, value }) {
  const max = LEVELS[id];
  const level = max ? value : null;

  function toggle() {
    setPrefs({ [id]: max ? (value + 1) % (max + 1) : !value });
  }

  return (
    <button
      type="button"
      className={"a11y__tile" + (value ? " is-on" : "")}
      aria-pressed={Boolean(value)}
      aria-label={max ? `${label}, level ${level} of ${max}` : undefined}
      onClick={toggle}
    >
      <Icon name={id} />
      <span className="a11y__label">{label}</span>
      {max && (
        <span className="a11y__levels" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => (
            <i key={i} className={i < level ? "is-on" : undefined} />
          ))}
        </span>
      )}
    </button>
  );
}

// a horizontal band that follows the pointer, for keeping your place in a line of text
function ReadingGuide() {
  const ref = useRef(null);
  useEffect(() => {
    function onMove(e) {
      if (ref.current) ref.current.style.transform = `translateY(${e.clientY}px)`;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return <div className="a11y-guide" ref={ref} aria-hidden="true" />;
}

export default function AccessibilityWidget() {
  const prefs = useSyncExternalStore(subscribePrefs, getPrefs, getServerPrefs);
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef(null);
  // only the home page has the fixed header to park under; elsewhere stay in the corner
  const home = usePathname() === "/";
  const low = scrolled || !home;

  // the button starts up by the header and drops to the bottom corner once the hero
  // is mostly scrolled away, so it never sits on the hero's bottom row
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <div className="a11y">
      <button
        type="button"
        className={"a11y__fab" + (low ? " is-low" : "")}
        aria-label="Accessibility options"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
          <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3 6M12 14.5l3 6" />
        </svg>
      </button>

      {/* native modal dialog: focus trap, Escape to close and inert page come with it.
          clicking the dimmed backdrop (the dialog element itself) closes it too. */}
      <dialog
        ref={dialogRef}
        className="a11y__panel"
        aria-labelledby="a11y-title"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="a11y__inner">
          <header className="a11y__head">
            <h2 id="a11y-title">Accessibility Options</h2>
            <button type="button" className="a11y__close" aria-label="Close accessibility options" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          {GROUPS.map((group) => (
            <section key={group.title} className="a11y__group" aria-labelledby={"a11y-" + group.title}>
              <h3 id={"a11y-" + group.title}>{group.title}</h3>
              <div className="a11y__grid">
                {group.tiles.map(([id, label]) => (
                  <Tile key={id} id={id} label={label} value={prefs[id]} />
                ))}
              </div>
            </section>
          ))}

          <button type="button" className="a11y__reset" onClick={resetPrefs}>
            Reset Settings
          </button>

          <footer className="a11y__foot">
            <Link href="/accessibility" onClick={close}>Accessibility Statement</Link>
            <span>Settings are saved on this device.</span>
          </footer>
        </div>
      </dialog>

      {prefs.guide && <ReadingGuide />}
    </div>
  );
}
