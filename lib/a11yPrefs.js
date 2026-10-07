// visitor accessibility preferences. saved in localStorage, applied as data-a11y-* on <html>,
// and globals.css does the actual work off those attributes.

const KEY = "ff-a11y";

// text and lineHeight are levels (0 = off, up to 3); the rest are on/off
export const LEVELS = { text: 3, lineHeight: 3 };
export const DEFAULTS = {
  text: 0,
  lineHeight: 0,
  spacing: false,
  readable: false,
  still: false,
  cursor: false,
  contrast: false,
  grayscale: false,
  hideImages: false,
  links: false,
  guide: false,
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
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return { ...DEFAULTS }; // private mode / blocked storage: just don't remember
  }
}

export function getPrefs() {
  if (!state) state = load();
  return state;
}

export function getServerPrefs() {
  return DEFAULTS;
}

export function setPrefs(patch) {
  state = { ...getPrefs(), ...patch };
  applyPrefs(state, document.documentElement);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((fn) => fn());
}

export function resetPrefs() {
  setPrefs(DEFAULTS);
}

export function subscribePrefs(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
