// toast menu code: per-store config, the dump -> sections transform, and the api client.
// kept side-effect free so importing it never runs anything.

export const TOAST_HOST = process.env.TOAST_HOST || "https://ws-api.toasttab.com";

// per-store config: which toast menu/group feeds which section. rules are shared below.
export const LOCATIONS = [
  {
    id: "west-valley",
    label: "West Valley",
    address: "1980 W 3500 S",
    guid: "f061aad4-6929-4874-8f14-6eb88a0a8c05",
    cfg: {
      sushiMenu: "SUSHI",
      rollsPdf: "/pdf/west-valley-sushi-rolls.pdf",
      sides: ["KITCHEN", "Sides & Extras"],
      pho: ["KITCHEN", "Pho"],
      bento: ["KITCHEN", "Bento Box"],
      entrees: ["KITCHEN", "Main Dish"], 
      drinksMenu: "DRINKS",
      dessert: ["KITCHEN", "Dessert"],
    },
  },
  {
    id: "bountiful",
    label: "Bountiful",
    address: "595 W 2600 S",
    guid: "f3902730-3442-4a80-8409-71e31873ec5c",
    cfg: {
      sushiMenu: "SUSHI",
      rollsPdf: "/pdf/bountiful-sushi-rolls.pdf",
      sides: ["SUSHI", "Sushi Side"],
      pho: ["WOK & POT", "Pho"],
      bento: ["WOK & POT", "Bento Box"],
      entrees: ["WOK & POT", "Main Dish"],
      drinksMenu: "DRINK",
      dessert: ["WOK & POT", "Dessert"],
    },
  },
];

// ---- shared rules (same for both stores) ----
const EXCLUDE_DRINK_GROUPS = new Set([                 // drink groups we don't want on the site
  "cocktails", "na beverages", "non-alcoholic drinks", "new handcrafted cocktails",
  "new handcrafted lemonades n/a", "seltzers limited time",
]);
const DRINK_RENAME = { "spring summer cocktails": "Seasonal Cocktails" };  // toast name -> nicer label
const ALWAYS_SHOW_DRINK_GROUPS = new Set(["beer", "liquor", "sake"]);      // show these even if empty (placeholders)
// toast wraps staff-only junk in asterisks (* Corkage Fee *, ** ALLERGY **). never show those.
const isStaffFlag = (name) => /^\s*\*/.test(name || "");
const FORM_WORD = /\s+(Nigiri|Sashimi|HR|Hand\s*Roll)\b/i;
const baseName = (n) => n.replace(/\s*\(GF\)\s*/i, " ").replace(FORM_WORD, "").replace(/\s+/g, " ").trim();

// takes a toast dump + a store's config, returns the sections the front end renders
export function buildLocation(dump, cfg) {
  const menus = dump.menus.menus || [];
  const MG = dump.menus.modifierGroupReferences || {};
  const MO = dump.menus.modifierOptionReferences || {};
  const ref = (map, id) => map[id] || map[String(id)];
  const menu = (n) => menus.find((m) => m.name === n);
  const group = (mn, gn) => (menu(mn)?.menuGroups || []).find((g) => g.name === gn);
  const stockArr = Array.isArray(dump.stock) ? dump.stock : (dump.stock?.inventory || []);
  const soldOut = new Set(stockArr.filter((s) => /OUT/i.test(s.status || "")).map((s) => s.guid));
  const isOut = (it) => soldOut.has(it.guid);

  function tagSection(title, menuName, groupName, note) {
    const g = group(menuName, groupName);
    if (!g) return null;
    const seen = new Set();
    const items = [];
    for (const it of g.menuItems || []) {
      const name = (it.name || "").trim();
      if (!name || isStaffFlag(name) || seen.has(name)) continue;
      seen.add(name);
      items.push(isOut(it) ? { name, available: false } : { name });
    }
    if (!items.length) return null;
    const s = { title, style: "tags", columns: 3, items };
    if (note) s.note = note;
    return s;
  }

  function sushiBar() {
    const fish = new Map();
    let order = 0;
    for (const gname of ["Nigiri", "Sashimi"]) {
      for (const it of group(cfg.sushiMenu, gname)?.menuItems || []) {
        if (/combo/i.test(it.name) || isStaffFlag(it.name)) continue;
        const b = baseName(it.name);
        if (!b) continue;
        if (!fish.has(b)) fish.set(b, { name: b, order: order++, available: true });
        if (isOut(it)) fish.get(b).available = false;
      }
    }
    for (const it of group(cfg.sushiMenu, "Hand Rolls")?.menuItems || []) {
      const b = baseName(it.name);
      if (fish.has(b) && isOut(it)) fish.get(b).available = false;
    }
    const items = [...fish.values()].sort((a, b) => a.order - b.order)
      .map((f) => (f.available ? { name: f.name } : { name: f.name, available: false }));
    if (!items.length) return null;
    const sec = { title: "Sushi Bar", note: "Nigiri or Sashimi", style: "tags", columns: 3, items };
    if (cfg.rollsPdf) sec.link = { label: "View Sushi Rolls", href: cfg.rollsPdf };
    return sec;
  }

  function bentoSection() {
    const g = group(cfg.bento[0], cfg.bento[1]);
    const item = (g?.menuItems || []).find((i) => /bento box/i.test(i.name)) || g?.menuItems?.[0];
    if (!item) return null;
    let proteinGroup = null;
    for (const id of item.modifierGroupReferences || []) {
      const mg = ref(MG, id);
      if (mg && /protein|entree/i.test(mg.name)) { proteinGroup = mg; break; }
    }
    if (!proteinGroup) return null;
    const seen = new Set();
    const items = [];
    for (const id of proteinGroup.modifierOptionReferences || []) {
      const o = ref(MO, id);
      const name = (o?.name || "").trim();
      if (!name || isStaffFlag(name) || seen.has(name)) continue;
      seen.add(name);
      items.push(soldOut.has(o.guid) ? { name, available: false } : { name });
    }
    if (!items.length) return null;
    return { title: "Bento Box", note: "Choice of protein, served w/ salad, California roll & rice", style: "tags", columns: 3, items };
  }

  function drinkParts(g) {
    const parts = [];
    for (const it of g.menuItems || []) {
      const name = (it.name || "").trim();
      if (!name || isStaffFlag(name)) continue;
      parts.push(isOut(it) ? { name, available: false } : { name });
    }
    return parts;
  }

  // toast group -> [{label, items}]. items sitting on the parent get an unlabeled group first.
  function toGroups(g) {
    if (!g) return [];
    const out = [];
    const direct = drinkParts(g);
    if (direct.length) out.push({ label: "", items: direct });
    for (const sg of g.menuGroups || []) {
      const items = drinkParts(sg);
      if (items.length) out.push({ label: sg.name, items });
    }
    return out;
  }

  // one alcohol section (Beer / Wine / Sake / Liquor). null if the store doesn't have it.
  function drinkSection(title, groupName) {
    const groups = toGroups(group(cfg.drinksMenu, groupName));
    if (!groups.length) return null;
    return { title, style: "grouped", columns: 2, groups };
  }

  // catch-all at the end: seasonal cocktails + lemonades + dessert
  function beveragesSection() {
    const groups = [
      ...toGroups(group(cfg.drinksMenu, "Spring Summer Cocktails")).map((g) => ({ ...g, label: g.label || "Seasonal Cocktails" })),
      ...toGroups(group(cfg.drinksMenu, "New Handcrafted Lemonades N/A")),
      ...toGroups(group(cfg.dessert[0], cfg.dessert[1])).map((g) => ({ ...g, label: g.label || "Dessert" })),
    ];
    if (!groups.length) return null;
    return { title: "Beverages & Desserts", style: "grouped", columns: 2, groups };
  }

  function featured() {
    const fromToast = tagSection("Featured Items", cfg.sushiMenu, "Featured", "Chef's picks");
    if (fromToast) return fromToast;
    return {
      title: "Featured Items", note: "Chef's picks", style: "tags", columns: 3,
      items: [{ name: "Omakase" }, { name: "Chef's Choice" }, { name: "Otoro" }],
    };
  }

  return [
    featured(),
    sushiBar(),
    tagSection("Sides", cfg.sides[0], cfg.sides[1]),
    tagSection("Pho", cfg.pho[0], cfg.pho[1], "Rice noodle soup"),
    bentoSection(),
    tagSection("Entrées", cfg.entrees[0], cfg.entrees[1], "Choice of chicken, beef, shrimp, tofu, or vegetables"),
    drinkSection("Beer", "Beer"),
    drinkSection("Wine", "Wine"),
    drinkSection("Sake", "Sake"),
    drinkSection("Liquor", "Liquor"),
    beveragesSection(),
  ].filter(Boolean);
}

// ---- toast api client ----
// fetch wrapper: adds the auth + restaurant guid headers, throws with the status
async function toastFetch(path, { host = TOAST_HOST, token, guid, method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (guid) headers["Toast-Restaurant-External-ID"] = guid;
  const res = await fetch(host + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) { const e = new Error(`${method} ${path} -> ${res.status}`); e.status = res.status; e.payload = json; throw e; }
  return json;
}

// log in, hand back a bearer token + how long it's good for (seconds)
export async function authenticate(host, clientId, clientSecret) {
  const data = await toastFetch("/authentication/v1/authentication/login", {
    host, method: "POST",
    body: { clientId, clientSecret, userAccessType: "TOAST_MACHINE_CLIENT" },
  });
  const token = data?.token?.accessToken;
  if (!token) throw new Error("No accessToken in Toast auth response");
  return { token, ttl: data.token.expiresIn || 3600 };
}

// grab one location's menu + stock. returns the { menus, stock } shape buildLocation wants.
export async function fetchLocationDump(host, token, guid) {
  const menus = await toastFetch("/menus/v2/menus", { host, token, guid });
  let stock = null;
  // stock (sold-out) is optional — if it fails, don't kill the whole menu, just skip 86s
  try { stock = await toastFetch("/stock/v1/inventory", { host, token, guid }); }
  catch { stock = []; }
  return { menus, stock };
}
