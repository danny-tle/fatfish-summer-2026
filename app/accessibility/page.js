import Link from "next/link";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";
import { telHref } from "@/lib/tel";

export const metadata = {
  title: "Accessibility Statement — Fat Fish",
  description: "How Fat Fish works to make its website usable for everyone, and how to reach us if something gets in your way.",
};

export default function AccessibilityPage() {
  return (
    <main id="top" className="statement" tabIndex={-1}>
      <Link className="statement__back" href="/">&larr; Back to Fat Fish</Link>
      <h1>Accessibility Statement</h1>

      <p>
        Fat Fish wants everyone to be able to browse the menu, find a location, and order online. We aim to meet the{" "}
        <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
          Web Content Accessibility Guidelines (WCAG) 2.2
        </a>{" "}
        at level AA.
      </p>

      <h2>What We&rsquo;ve Done</h2>
      <ul>
        <li>The whole site works with a keyboard, with a visible focus outline and a skip link to the main content.</li>
        <li>Images have text descriptions, and sold-out menu items are announced to screen readers.</li>
        <li>Text meets AA color contrast, and the site honors your device&rsquo;s reduced-motion setting.</li>
        <li>Moving content, like the photo gallery and rotating address, has a pause button.</li>
        <li>
          The accessibility button in the corner of every page lets you enlarge text, adjust line height and spacing,
          switch to a low-vision or dyslexia-friendly font, stop animations, use a reading line or mask, have text read
          aloud, jump through the page&rsquo;s headings, and change contrast, brightness, saturation or apply color-vision
          filters. Your choices are saved on your device.
        </li>
      </ul>

      <h2>Known Limitations</h2>
      <ul>
        <li>The contact form doesn&rsquo;t send messages yet. Please call either location instead.</li>
        <li>
          Online ordering, Uber Eats and DoorDash are run by other companies, so their accessibility is outside our
          control.
        </li>
        <li>The sushi roll menus are PDFs and may not read well with every screen reader. Staff can read them to you by phone.</li>
      </ul>

      <h2>Tell Us What Isn&rsquo;t Working</h2>
      <p>If anything on this site gets in your way, call us and we&rsquo;ll help you directly and fix the problem.</p>
      <ul>
        {LOCATION_IDS.map((id) => (
          <li key={id}>
            {LOCATIONS[id].label}: <a href={telHref(LOCATIONS[id].phone)}>{LOCATIONS[id].phone}</a>
          </li>
        ))}
      </ul>

      <p className="statement__date">Last reviewed October 2026.</p>
    </main>
  );
}
