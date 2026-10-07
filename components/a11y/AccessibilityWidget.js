"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  COLOR_FILTERS,
  LEVELS,
  LEVEL_NAMES,
  getPrefs,
  getServerPrefs,
  resetPrefs,
  setPrefs,
  subscribePrefs,
} from "@/lib/a11yPrefs";
import { ColorFilterDefs, PageReader, ReadingLine, ReadingMask, Tooltips } from "./tools";
import PageStructure from "./PageStructure";

// 24px icons in currentColor. stroke by default; the text glyphs and solid shapes fill.
const glyph = (t) => (
  <text x="12" y="17.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor" stroke="none">
    {t}
  </text>
);
const ICONS = {
  text: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8M10.5 7.5v6M7.5 10.5h6" /></>,
  lineHeight: <><path d="M3 7l2.5-2.5L8 7M3 17l2.5 2.5L8 17M5.5 4.5v15M11 6h10M11 12h10M11 18h10" /></>,
  spacing: <><path d="M7 8l-4 4 4 4M17 8l4 4-4 4M3 12h18" /></>,
  readable: glyph("Aa"),
  dyslexia: glyph("Ap"),
  cursor: <path d="M5 3l14 6.5-6.2 1.8L10.5 18z" />,
  tooltips: <><path d="M4 4h16v12H10l-4 4v-4H4z" /><path d="M12 8v.01M12 10.5V13" /></>,
  hideImages: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 15l-5-5-8 8M3 3l18 18" /></>,
  still: <><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></>,
  readingLine: <rect x="3" y="10" width="18" height="4" rx="2" />,
  readingMask: <><rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" /><rect x="3" y="10" width="18" height="4" fill="#fff" stroke="none" /></>,
  links: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  readPage: <><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></>,
  structure: <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  invert: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" /></>,
  contrast: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" /></>,
  brightness: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  saturation: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9 14.5a3 3 0 0 0 3 3" /></>,
  move: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
};

const CONTENT = [
  ["text", "Bigger Text"],
  ["lineHeight", "Line Height"],
  ["spacing", "Text Spacing"],
  ["readable", "Readable Font"],
  ["dyslexia", "Dyslexia Friendly"],
  ["cursor", "Bigger Cursor"],
  ["tooltips", "Tooltips"],
  ["hideImages", "Hide Images"],
  ["still", "Stop Animations"],
];
const NAVIGATION = [
  ["readingLine", "Reading Line"],
  ["readingMask", "Reading Mask"],
  ["links", "Highlight Links"],
  ["readPage", "Read Page"],
];
const COLORS = [
  ["invert", "Invert Colors"],
  ["contrast", "Contrast"],
  ["brightness", "Brightness"],
  ["saturation", "Saturation"],
];

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

// one tile. on/off settings toggle; stepped ones cycle off → 1 → … → max → off.
function Tile({ id, label, value, onClick }) {
  const max = LEVELS[id];
  let name;
  if (max && value) name = LEVEL_NAMES[id] ? `${label}: ${LEVEL_NAMES[id][value - 1]}` : `${label}, level ${value} of ${max}`;

  return (
    <button
      type="button"
      className={"a11y__tile" + (value ? " is-on" : "")}
      aria-pressed={onClick ? undefined : Boolean(value)}
      aria-label={name}
      onClick={onClick || (() => setPrefs({ [id]: max ? (value + 1) % (max + 1) : !value }))}
    >
      <Icon name={id} />
      <span className="a11y__label">{label}</span>
      {max && (
        <span className="a11y__levels" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => (
            <i key={i} className={i < value ? "is-on" : undefined} />
          ))}
        </span>
      )}
    </button>
  );
}

function Group({ title, children }) {
  const id = "a11y-" + title.toLowerCase();
  return (
    <section className="a11y__group" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <div className="a11y__grid">{children}</div>
    </section>
  );
}

export default function AccessibilityWidget() {
  const prefs = useSyncExternalStore(subscribePrefs, getPrefs, getServerPrefs);
  const [scrolled, setScrolled] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const panelRef = useRef(null);
  const fabRef = useRef(null);
  const structureRef = useRef(null);
  // only the home page has the fixed header to park under; elsewhere stay in the corner
  const home = usePathname() === "/";
  const low = scrolled || !home;

  // the button starts up by the header and drops to the bottom corner once the hero
  // is mostly scrolled away, so it never sits on the hero's bottom row.
  // back-to-top shows from the same point.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closePanel() {
    panelRef.current?.close();
  }

  function openStructure() {
    closePanel();
    structureRef.current?.open();
  }

  function backToTop() {
    window.scrollTo({ top: 0 }); // html scroll-behavior decides smooth vs instant
    document.getElementById("top")?.focus({ preventScroll: true });
  }

  return (
    <div className="a11y">
      <button
        ref={fabRef}
        type="button"
        className={"a11y__fab" + (low ? " is-low" : "") + (scrolled ? " is-stacked" : "")}
        aria-label="Accessibility options"
        aria-haspopup="dialog"
        onClick={() => panelRef.current?.showModal()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
          <circle cx="12" cy="4" r="2.2" />
          <path d="M4.5 7.2c-.6-.2-1.2.2-1.3.8-.1.5.2 1 .7 1.2L9 10.6V14l-2 6.6c-.2.6.2 1.2.8 1.4.6.2 1.2-.1 1.4-.7L11 15.6h2l1.8 5.7c.2.6.8.9 1.4.7.6-.2 1-.8.8-1.4L15 14v-3.4l5.1-1.4c.5-.2.8-.7.7-1.2-.1-.6-.7-1-1.3-.8L13 8.8h-2z" />
        </svg>
      </button>

      <button
        type="button"
        className={"a11y__top" + (scrolled ? " is-shown" : "")}
        aria-label="Back to top"
        onClick={backToTop}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>

      {/* native modal dialog: focus trap, Escape to close and inert page come with it.
          clicking the dimmed backdrop (the dialog element itself) closes it too. */}
      <dialog
        ref={panelRef}
        className="a11y__panel"
        aria-labelledby="a11y-title"
        onClick={(e) => e.target === e.currentTarget && closePanel()}
      >
        <div className="a11y__inner">
          <header className="a11y__head">
            <h2 id="a11y-title">Accessibility Options</h2>
            <button type="button" className="a11y__close" aria-label="Close accessibility options" onClick={closePanel}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="a11y__body">
            <Group title="Content">
              {CONTENT.map(([id, label]) => (
                <Tile key={id} id={id} label={label} value={prefs[id]} />
              ))}
            </Group>

            <Group title="Navigation">
              {NAVIGATION.map(([id, label]) => (
                <Tile key={id} id={id} label={label} value={prefs[id]} />
              ))}
              <Tile id="structure" label="Page Structure" onClick={openStructure} />
            </Group>

            <Group title="Colors">
              {COLORS.map(([id, label]) => (
                <Tile key={id} id={id} label={label} value={prefs[id]} />
              ))}
              <div className="a11y__filters" role="group" aria-labelledby="a11y-filters-title">
                <p id="a11y-filters-title">Color Filters</p>
                <div className="a11y__chips">
                  {COLOR_FILTERS.map((f) => {
                    const on = prefs.colorFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        className={"a11y__chip" + (on ? " is-on" : "")}
                        aria-pressed={on}
                        onClick={() => setPrefs({ colorFilter: on ? "" : f.id })}
                      >
                        <i style={{ "--a": f.swatch[0], "--b": f.swatch[1] }} aria-hidden="true" />
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Group>

            <section className="a11y__move">
              <h3>
                <button
                  type="button"
                  className="a11y__disclosure"
                  aria-expanded={moveOpen}
                  aria-controls="a11y-move-options"
                  onClick={() => setMoveOpen((o) => !o)}
                >
                  <span className="a11y__badge"><Icon name="move" /></span>
                  Move Accessibility Widget
                  <svg className="a11y__caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M7 14l5-5 5 5z" fill="currentColor" />
                  </svg>
                </button>
              </h3>
              <fieldset id="a11y-move-options" className="a11y__radios" hidden={!moveOpen}>
                <legend className="sr-only">Widget position</legend>
                {["left", "right"].map((side) => (
                  <label key={side}>
                    {side === "left" ? "Left" : "Right"}
                    <input
                      type="radio"
                      name="a11y-side"
                      value={side}
                      checked={prefs.side === side}
                      onChange={() => setPrefs({ side })}
                    />
                  </label>
                ))}
              </fieldset>
            </section>

            <p className="a11y__statement">
              <Link href="/accessibility" onClick={closePanel}>Accessibility Statement</Link>
              <span>Settings are saved on this device.</span>
            </p>
          </div>

          <footer className="a11y__foot">
            <button type="button" className="a11y__reset" onClick={resetPrefs}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
              </svg>
              Reset Settings
            </button>
          </footer>
        </div>
      </dialog>

      <PageStructure ref={structureRef} onDismiss={() => fabRef.current?.focus()} />

      <ColorFilterDefs />
      {prefs.readingLine && <ReadingLine />}
      {prefs.readingMask && <ReadingMask />}
      {prefs.tooltips && <Tooltips />}
      {prefs.readPage && <PageReader />}
    </div>
  );
}
