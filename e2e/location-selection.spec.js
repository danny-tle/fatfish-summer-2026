import { expect, test } from "@playwright/test";

async function chooseLocation(page, name) {
  const picker = page.getByRole("dialog", { name: "Choose a location" });
  await picker.getByRole("button", { name: new RegExp(name) }).click();
  // Role queries intentionally omit aria-hidden elements after selection.
  await expect(page.locator(".picker")).toHaveAttribute("aria-hidden", "true");
}

test("a Bountiful visitor sees Bountiful links and menu controls", async ({ page }) => {
  await page.goto("/");
  await chooseLocation(page, "Bountiful");

  await expect(page.getByText("Fat Fish — Bountiful")).toBeVisible();
  await expect(page.getByRole("link", { name: "Fat Fish Bountiful on Instagram" })).toHaveAttribute("href", /fatfish\.bountiful/);
  await expect(page.getByRole("tab", { name: /Bountiful.*595 W 2600 S/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: "Order Takeout" })).toHaveAttribute("href", /fat-fish-bountiful/);
});

test("the mobile navigation exposes its expanded state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "The menu toggle is only visible at the mobile breakpoint.");
  await page.goto("/");
  await chooseLocation(page, "West Valley");

  const menuButton = page.getByRole("button", { name: "Menu", exact: true });
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" })).toBeVisible();
});
