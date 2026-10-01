import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { LocationProvider } from "@/context/LocationContext";
import SplashPicker from "@/components/SplashPicker";
import Story from "@/components/Story";
import Social from "@/components/Social";
import Order from "@/components/Order";

it("keeps location-specific content together after a visitor chooses Bountiful", () => {
  render(
    <LocationProvider>
      <SplashPicker />
      <Story />
      <Social />
      <Order />
    </LocationProvider>
  );

  const picker = screen.getByRole("dialog", { name: "Choose a location" });
  fireEvent.click(within(picker).getByRole("button", { name: /Bountiful.*595 W 2600 S/ }));

  expect(picker).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("Fat Fish — Bountiful")).toBeTruthy();
  expect(screen.getByAltText("The sushi bar at Fat Fish Bountiful under string lights")).toHaveAttribute("src", "/img/bountiful/story-1.jpg");
  expect(screen.getByRole("link", { name: "Fat Fish Bountiful on Instagram" })).toHaveAttribute("href", "https://www.instagram.com/fatfish.bountiful/");
  expect(screen.getByRole("link", { name: "Order Takeout" })).toHaveAttribute("href", "https://order.toasttab.com/online/fat-fish-bountiful-sapa-595-west-2600-south");
});
