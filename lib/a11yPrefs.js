// visitor accessibility preferences. saved in localStorage, applied as data-a11y-* on <html>,
// and globals.css does the actual work off those attributes.

const KEY = "ff-a11y";

// stepped settings: 0 = off, up to the max here. everything else is on/off or a string.
export const LEVELS = { text: 3, lineHeight: 3, spacing: 3, contrast: 2, brightness: 2, saturation: 2 };
// spoken/visible names for the two-step settings, so "level 1 of 2" isn't all a visitor gets
export const LEVEL_NAMES = {
  contrast: ["Higher", "Maximum"],
  brightness: ["Brighter", "Brightest"],
  saturation: ["Low", "High"],
};
// turning one of these on turns the other off
export const EXCLUSIVE = { readable: "dyslexia", dyslexia: "readable" };

export const COLOR_FILTERS = [
  { id: "grayscale", label: "Grayscale", swatch: ["#9a9a9f", "#9a9a9f"] },
  { id: "protan", label: "Red/Green", swatch: ["#e0443b", "#8ee45a"] },
  { id: "tritan", label: "Blue/Yellow", swatch: ["#1a1aff", "#f6f04d"] },
  { id: "deutan", label: "Green/Red", swatch: ["#8ee45a", "#e0443b"] },
];

export const DEFAULTS = {
  text: 0,
  lineHeight: 0,
  spacing: 0,
  readable: false,
  dyslexia: false,
  cursor: false,
  tooltips: false,
  hideImages: false,
  still: false,
  readingLine: false,
  readingMask: false,
  links: false,
  readPage: false,
  invert: false,
  contrast: 0,
  brightness: 0,
  saturation: 0,
  colorFilter: "",
  side: "right",
};

// self-contained on purpose: layout.js inlines its source as a pre-paint script,
// so saved settings apply before first paint instead of flashing in after hydration.
export function applyPrefs(prefs, root) {
  for (var key in prefs) {
    var attr = "data-a11y-" + key.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); });
    var value = prefs[key];
    if (value) root.setAttribute(attr, value === true ? "" : String(value));
    else root.removeAttribute(attr);
  }
}

export const PREPAINT_SCRIPT =
  "try{(" + applyPrefs.toString() + ')(JSON.parse(localStorage.getItem("' + KEY + '"))||{},document.documentElement)}catch(e){}';

let state = null;
const listeners = new Set();

function load() {
  const prefs = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || {};
    // only known keys, so a setting we've since removed doesn't linger
    for (const key in DEFAULTS) if (key in saved) prefs[key] = saved[key];
  } catch {} // private mode / blocked storage: just don't remember
  return prefs;
}

export function getPrefs() {
  if (!state) state = load();
  return state;
}

export function getServerPrefs() {
  return DEFAULTS;
}

export function setPrefs(patch) {
  const next = { ...getPrefs(), ...patch };
  for (const key in patch) if (patch[key] && EXCLUSIVE[key]) next[EXCLUSIVE[key]] = false;
  state = next;
  applyPrefs(state, document.documentElement);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((fn) => fn());
}

export function resetPrefs() {
  // where the button sits is a layout choice, not a setting to undo
  setPrefs({ ...DEFAULTS, side: getPrefs().side });
}

export function subscribePrefs(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
