// server-side data fetch for the menu page. runs on vercel, never in the browser —
// that's the whole point of the next.js poc: bake the menu into the html instead
// of the client fetching it after the page loads.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOCATIONS, buildLocation, authenticate, fetchLocationDump, TOAST_HOST } from "./menu.mjs";

export async function getMenuData() {
  try {
    const { token } = await authenticate(TOAST_HOST, process.env.TOAST_CLIENT_ID, process.env.TOAST_CLIENT_SECRET);
    const locations = await Promise.all(
      LOCATIONS.map(async (loc) => {
        const dump = await fetchLocationDump(TOAST_HOST, token, loc.guid);
        return { id: loc.id, label: loc.label, address: loc.address, sections: buildLocation(dump, loc.cfg) };
      })
    );
    return { locations, source: "toast" };
  } catch (e) {
    // toast's down (or creds missing) -> fall back to the bundled snapshot, same idea
    // as the vite site's assets/data/menu.json fallback
    const snapshot = JSON.parse(await readFile(path.join(process.cwd(), "data/menu.json"), "utf8"));
    console.error("getMenuData: falling back to snapshot —", e.message);
    return { ...snapshot, source: "snapshot", staleReason: e.message };
  }
}
