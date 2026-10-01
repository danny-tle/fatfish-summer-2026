// runs on the server so the menu is baked into the html instead of fetched later
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
    // toast down or creds missing, fall back to the committed snapshot
    const snapshot = JSON.parse(await readFile(path.join(process.cwd(), "data/menu.json"), "utf8"));
    console.error("getMenuData: falling back to snapshot —", e.message);
    return { ...snapshot, source: "snapshot", staleReason: e.message };
  }
}
