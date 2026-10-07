import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.doUnmock("@/lib/menu.mjs");
  vi.resetModules();
});

describe("getMenuData", () => {
  it("uses the committed snapshot when Toast authentication fails", async () => {
    vi.doMock("@/lib/menu.mjs", () => ({
      LOCATIONS: [],
      TOAST_HOST: "https://toast.example",
      authenticate: vi.fn().mockRejectedValue(new Error("credentials unavailable")),
      buildLocation: vi.fn(),
      fetchLocationDump: vi.fn(),
    }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getMenuData } = await import("@/lib/getMenuData.js");

    const data = await getMenuData();

    expect(data.source).toBe("snapshot");
    expect(data.locations.map((location) => location.id)).toEqual(["west-valley", "bountiful"]);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("falling back to snapshot"), "credentials unavailable");
    error.mockRestore();
  });

  it("returns normalized live menus when Toast is available", async () => {
    const authenticate = vi.fn().mockResolvedValue({ token: "test-token" });
    const fetchLocationDump = vi.fn().mockResolvedValue({ raw: "toast-response" });
    const buildLocation = vi.fn().mockReturnValue([{ title: "Sushi Bar" }]);
    vi.doMock("@/lib/menu.mjs", () => ({
      LOCATIONS: [{ id: "west-valley", label: "West Valley", address: "1980 W 3500 S", guid: "west-guid", cfg: {} }],
      TOAST_HOST: "https://toast.example",
      authenticate,
      fetchLocationDump,
      buildLocation,
    }));
    const { getMenuData } = await import("@/lib/getMenuData.js");

    await expect(getMenuData()).resolves.toEqual({
      source: "toast",
      locations: [{ id: "west-valley", label: "West Valley", address: "1980 W 3500 S", sections: [{ title: "Sushi Bar" }] }],
    });
    expect(fetchLocationDump).toHaveBeenCalledWith("https://toast.example", "test-token", "west-guid");
  });
});

describe("menu snapshot", () => {
  it("links only to PDFs that exist in public/", async () => {
    const { existsSync } = await import("node:fs");
    const { default: snapshot } = await import("@/data/menu.json");
    const hrefs = snapshot.locations.flatMap((loc) => loc.sections.map((s) => s.link?.href).filter(Boolean));

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^\//);
      expect(existsSync("public" + href), href).toBe(true);
    }
  });
});
