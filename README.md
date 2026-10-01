# Fat Fish

Marketing site for Fat Fish, a sushi and pho restaurant with two locations in
Utah (West Valley City and Bountiful). Next.js 16 (App Router) + React 19, plain
JavaScript, deployed on Vercel.

Live: https://fatfish-summer-2026.vercel.app

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the Toast credentials
npm run dev                  # http://localhost:3000
```

The Toast credentials are optional for local work. Without them the menu falls
back to the snapshot in `data/menu.json`, which is enough for everything except
testing the live feed.

```bash
npm run build   # production build
npm run lint    # should be clean
```

## How the menu works

The menu is pulled from the Toast POS API on the server and baked into the HTML,
so the page never arrives with an empty menu area. It revalidates every 60
seconds (`export const revalidate = 60` in `app/page.js`).

- `lib/menu.mjs` — Toast API client plus the transform that turns a raw Toast
  dump into the sections the site renders. Per-store config lives at the top.
- `lib/getMenuData.js` — calls the above, and falls back to `data/menu.json` if
  Toast is down or the credentials are missing.
- `data/menu.json` — last known good snapshot, committed on purpose so the site
  still shows a menu during a Toast outage.

## Project layout

```
app/          layout, page, global CSS
components/   one file per section of the page
context/      LocationContext — which store is active
hooks/        small shared hooks
lib/          data and the Toast integration
data/         committed menu snapshot
public/       photos, menu PDFs, logo
```

Both locations share the same page. `context/LocationContext.js` holds the
active store and every section reads it from there, so the menu, story copy,
photos, addresses, order links, social links and directions all switch together.
Per-store content lives in `lib/locations.js`; photos follow a positional naming
convention (`public/img/<store>/slide-1..7.jpg`, `story-1.jpg`, `story-2.jpg`).

## Notes

- We use plain `<img>` rather than `next/image`. The global `img` rule in
  `globals.css` handles sizing and `object-fit` for the photo sections, and
  `next/image`'s wrapper element fights it. The rule is turned off explicitly in
  `eslint.config.mjs`.
- The contact form does not send anything yet.
