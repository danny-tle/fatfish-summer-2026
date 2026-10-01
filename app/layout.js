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
      </body>
    </html>
  );
}
