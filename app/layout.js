import { Archivo, Fraunces } from "next/font/google";
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
    <html lang="en" className={`${archivo.variable} ${fraunces.variable}`}>
      <body>
        <a className="skip-link" href="#top">Skip to Content</a>
        {children}
      </body>
    </html>
  );
}
