import "./globals.css";

export const metadata = {
  title: "Fat Fish",
  description: "Fat Fish is West Valley City's go-to place for inventive sushi and pho. An industrial space, a welcoming staff, and a modern vibe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* shared svg symbol referenced by Hero's <use href="#pufferfish" /> */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <symbol id="pufferfish" viewBox="0 0 64 40">
            <path
              d="M61 6c-3 3-6 5-9 6 1 2 1 5 0 8 3 1 6 3 9 6-5-1-9-2-13-4-4 6-11 10-19 10C13 38 3 30 3 20S13 2 29 2c8 0 15 4 19 10 4-2 8-4 13-6Z"
              fill="currentColor"
            />
            <circle cx="20" cy="17" r="2.6" fill="var(--ink,#1c1a17)" />
            <path d="M30 24c4 2 9 2 13 0" stroke="var(--ink,#1c1a17)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </symbol>
        </svg>
      </body>
    </html>
  );
}
