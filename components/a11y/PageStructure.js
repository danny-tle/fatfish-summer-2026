"use client";
import { useImperativeHandle, useRef, useState } from "react";

const LANDMARKS = [
  ["Navigation", "header nav"],
  ["Main Content", "main"],
  ["Footer", "footer"],
];

// a list of the page's headings and regions; picking one jumps there and moves focus to it
export default function PageStructure({ ref, onDismiss }) {
  const dialogRef = useRef(null);
  const jumped = useRef(false);
  const [items, setItems] = useState({ headings: [], landmarks: [] });

  useImperativeHandle(ref, () => ({
    open() {
      setItems({
        headings: Array.from(document.querySelectorAll("main :is(h1, h2, h3)")).map((el) => ({
          el,
          level: Number(el.tagName[1]),
          text: el.textContent.trim(),
        })),
        landmarks: LANDMARKS.map(([label, sel]) => ({ label, el: document.querySelector(sel) })).filter((l) => l.el),
      });
      dialogRef.current?.showModal();
    },
  }));

  function jump(el) {
    jumped.current = true;
    dialogRef.current?.close();
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
      el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
    }
    el.scrollIntoView({ block: "start" });
    el.focus({ preventScroll: true });
  }

  function onClose() {
    // closed without picking anything: hand focus back to the floating button
    if (!jumped.current) onDismiss?.();
    jumped.current = false;
  }

  return (
    <dialog
      ref={dialogRef}
      className="a11y__panel a11y__panel--structure"
      aria-labelledby="a11y-structure-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
    >
      <div className="a11y__inner">
        <header className="a11y__head">
          <h2 id="a11y-structure-title">Page Structure</h2>
          <button type="button" className="a11y__close" aria-label="Close page structure" onClick={() => dialogRef.current?.close()}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="a11y__body">
          <section className="a11y__group" aria-labelledby="a11y-structure-headings">
            <h3 id="a11y-structure-headings">Headings</h3>
            <ul className="a11y__list">
              {items.headings.map((h, i) => (
                <li key={i} style={{ "--depth": h.level - 1 }}>
                  <button type="button" onClick={() => jump(h.el)}>
                    <span className="a11y__tag">H{h.level}</span>
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="a11y__group" aria-labelledby="a11y-structure-regions">
            <h3 id="a11y-structure-regions">Regions</h3>
            <ul className="a11y__list">
              {items.landmarks.map((l) => (
                <li key={l.label}>
                  <button type="button" onClick={() => jump(l.el)}>{l.label}</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </dialog>
  );
}
