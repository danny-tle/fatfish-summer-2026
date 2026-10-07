import { Archivo, Atkinson_Hyperlegible_Next, Fraunces, Lexend } from "next/font/google";
import AccessibilityWidget from "@/components/a11y/AccessibilityWidget";
import { PREPAINT_SCRIPT } from "@/lib/a11yPrefs";
import "./globals.css";

// self-hosted + preloaded by next/font. the css vars feed --grotesque / --serif in globals.css
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
// accessibility-panel fonts. not preloaded: they only download once someone turns them on.
const atkinson = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-atkinson", display: "swap", preload: false });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap", preload: false });

export const metadata = {
  title: "Fat Fish",
  description: "Fat Fish is West Valley City's go-to place for inventive sushi and pho. An industrial space, a welcoming staff, and a modern vibe.",
};

export const viewport = {
  themeColor: "#1c1a17",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    // the pre-paint script adds data-a11y-* attributes before React hydrates, hence the warning opt-out
    <html lang="en" className={[archivo, fraunces, atkinson, lexend].map((f) => f.variable).join(" ")} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#top">Skip to Content</a>
        {children}
        <AccessibilityWidget />
      </body>
    </html>
  );
}
