import { describe, expect, it } from "vitest";
import { buildLocation } from "@/lib/menu.mjs";

const cfg = {
  sushiMenu: "SUSHI",
  rollsPdf: "/pdf/rolls.pdf",
  sides: ["KITCHEN", "Sides"],
  pho: ["KITCHEN", "Pho"],
  bento: ["KITCHEN", "Bento"],
  entrees: ["KITCHEN", "Entrees"],
  drinksMenu: "DRINKS",
  dessert: ["KITCHEN", "Dessert"],
};

function group(name, menuItems = [], menuGroups = []) {
  return { name, menuItems, menuGroups };
}

const item = (name, guid, modifierGroupReferences) => ({ name, guid, modifierGroupReferences });

function toastDump() {
  return {
    menus: {
      menus: [
        {
          name: "SUSHI",
          menuGroups: [
            group("Featured", [item("Dragon Roll", "featured")]),
            group("Nigiri", [item("Tuna Nigiri", "tuna-nigiri"), item("Salmon Nigiri", "salmon"), item("* ALLERGY *", "staff")]),
            group("Sashimi", [item("Tuna Sashimi", "tuna-sashimi")]),
            group("Hand Rolls", [item("Tuna Hand Roll", "tuna-hand")]),
          ],
        },
        {
          name: "KITCHEN",
          menuGroups: [
            group("Sides", [item("Edamame", "edamame"), item("Edamame", "duplicate"), item("* Corkage Fee *", "staff-side")]),
            group("Pho", [item("Beef Pho", "pho")]),
            group("Bento", [item("Bento Box", "bento", ["protein-group"])]),
            group("Entrees", [item("Teriyaki", "entree")]),
            group("Dessert", [item("Mochi", "mochi")]),
          ],
        },
        {
          name: "DRINKS",
          menuGroups: [group("Beer", [item("Asahi", "beer")])],
        },
      ],
      modifierGroupReferences: {
        "protein-group": { name: "Choose protein", modifierOptionReferences: ["chicken", "staff-protein"] },
      },
      modifierOptionReferences: {
        chicken: { name: "Chicken", guid: "chicken" },
        "staff-protein": { name: "* Internal option *", guid: "staff-protein" },
      },
    },
    stock: [{ guid: "tuna-hand", status: "OUT_OF_STOCK" }],
  };
}

describe("buildLocation", () => {
  it("turns a Toast dump into the public menu without staff entries or duplicates", () => {
    const sections = buildLocation(toastDump(), cfg);

    expect(sections.map((section) => section.title)).toEqual([
      "Featured Items", "Sushi Bar", "Sides", "Pho", "Bento Box", "Entrées", "Beer", "Beverages & Desserts",
    ]);
    expect(sections.find((section) => section.title === "Sides").items).toEqual([{ name: "Edamame" }]);
    expect(sections.find((section) => section.title === "Bento Box").items).toEqual([{ name: "Chicken" }]);
  });

  it("combines nigiri, sashimi, and hand-roll availability into one Sushi Bar entry", () => {
    const sushiBar = buildLocation(toastDump(), cfg).find((section) => section.title === "Sushi Bar");

    expect(sushiBar.items).toEqual([
      { name: "Tuna", available: false },
      { name: "Salmon" },
    ]);
    expect(sushiBar.link).toEqual({ label: "View Sushi Rolls", href: "/pdf/rolls.pdf" });
  });
});
