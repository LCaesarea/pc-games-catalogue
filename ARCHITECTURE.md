# ARCHITECTURE.md

## 1. Group

| Name | Student number |
|---|---|
| [Ackeem Thomas] | [100807236] |

## 2. Application

A catalogue of about 300 PC games from the last ten years, built for players deciding what to play next. Each entry has a title, release year, genre tags, whether it supports co-op, a short description and an editor's rating. There is also a weekly "new releases" list. I am the only editor: the game catalogue changes a few times a month and the releases list changes weekly.

## 3. Route Map

| Route | What it shows | Strategy | Why this moment | What it costs you | Proven by |
|---|---|---|---|---|---|
| `/` | Home page with links and the game count | Static | The text changes only when I edit the data, and is identical for every visitor. | Stale until the next build. | Produced-at time equals the build time and does not change on reload. |
| `/games` | Every game in the catalogue | Static | Changes a few times a month, on my schedule, and is identical for every visitor. | Stale until the next build; adding a game means rebuilding. | Produced-at time is fixed across reloads; the build route table shows it as static. |
| `/new-releases` | Games out now and coming up, based on today's date | Server-side | Changes weekly, and "out now" versus "coming up" depends on today's date, which a build cannot know. | A server renders it on every request: slower than a pre-built file, and hosting is paid for mostly identical HTML. | Produced-at time changes on every reload; the route table marks it dynamic. |
| `/search` | Filter games by title, genre or co-op | Client-side | The result depends on what each visitor types, so no answer exists at build time. | Extra JavaScript to ship; the results are not in the delivered HTML, so the page is a placeholder until it loads. | View Source shows only "Loading search…"; the results appear in the browser afterwards. |
| `/wishlist` | A visitor's saved games | Client-side | Per-visitor and changes with every click; there is no shared answer to build in advance. | Empty until JavaScript runs; saves live in one browser only, so clearing it or changing device loses the list. | View Source shows only "Loading your wishlist…"; a second browser shows an empty list. |

Route table printed by `npm run build` on the tagged commit (replace this with the output from your own machine):

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /games
├ ƒ /new-releases
├ ○ /search
└ ○ /wishlist

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

The route table labels `/search` and `/wishlist` as static because the page holding the placeholder is built in advance. The content is produced in the browser, which only View Source can show.

Navigation model: single-page application. Every link between routes uses `<Link>` from `next/link`, and there are no exceptions. This is separate from the rendering choices above.

## 4. Changes Since Report 1

| What Report 1 said | What we built | Why it changed |
|---|---|---|
| Content in a JSON file. | Content in typed TypeScript files in `data/`, read through `getGames()` and `getReleases()`. | The assignment requires TypeScript files in `data/`; it also gives compile-time checking of every entry. |
| `/games/[slug]` static detail pages. | Dropped. Each game's details appear on its card on `/games`. | The assignment's route rules centre on fixed-name routes, so I kept to those; a game's details appear on its card. |
| Server-side route verified by changing the data and reloading without rebuilding. | Verified by the produced-at time changing on every request. | Data in a TypeScript module is bundled at build time, so editing it needs a rebuild whatever the strategy. |
| Static routes: `/games` and `/games/[slug]`. | Static routes: `/` and `/games`. | Follows from dropping `[slug]`; `/` was added as the entry page. |

## 5. Content

Types (`data/types.ts`): `Game` (slug, title, year, genres, coop, rating, description) and `Release` (id, title, date, note).

| File | Functions | Used by |
|---|---|---|
| `data/games.ts` | `getGames()`, `getGenres()` | `/`, `/games`, `/search`, `/wishlist` |
| `data/releases.ts` | `getReleases()` | `/new-releases` |

The arrays are not exported, so pages and components can only get content through the functions.

Limitation I expect to hit: the content is compiled into the build, so any edit needs a rebuild and redeploy, and only someone comfortable with TypeScript and Git can edit it. Also, `/search` and `/wishlist` call `getGames()` in the browser, so the whole catalogue is shipped to every visitor in the JavaScript bundle. That is tolerable at about 300 entries but would not be at several thousand.

## 6. Components and Layouts

```
app/layout.tsx            (root layout: SiteNav + <main>, wraps every route)
├── app/page.tsx                      /
├── app/games/page.tsx                /games
├── app/new-releases/page.tsx         /new-releases
└── app/(tools)/layout.tsx            (nested layout: browser-tools banner)
    ├── app/(tools)/search/page.tsx   /search
    └── app/(tools)/wishlist/page.tsx /wishlist
```

Components (`components/`): `SiteNav`, `PageHeader` (all routes), `ProducedAt` (`/`, `/games`, `/new-releases`), `GameCard` (`/games`, `/search`, `/wishlist`), `ReleaseList` (`/new-releases`), `WishlistButton`, `SearchPanel`, `WishlistPanel`.

`'use client'` files:

| File | Why it needs the browser |
|---|---|
| `components/WishlistButton.tsx` | localStorage for the saved list and a click handler. |
| `components/SearchPanel.tsx` | State for the filters, change handlers, and results produced after load. |
| `components/WishlistPanel.tsx` | localStorage holds this visitor's saved games, so the list is produced after load. |

Helper hooks in `lib/` (`useIsClient`, `useWishlist`) are only imported by those client files. Stylesheet: `app/globals.css`, with every rule scoped under `.pcg`.

## 7. Trade-offs

**`/new-releases` as a static page (rejected).** Pre-building it and rebuilding weekly would have given the fastest page, no server to run, and one fewer moving part. I rejected it because the page depends on today's date as well as my edits: "out now" is wrong the day after a build even if I change nothing. Because it is identical for every visitor, rendering it on the server costs some speed and hosting but removes the need for me to remember to rebuild. I would reverse this if rebuilds ran automatically on a schedule, or if traffic grew until per-request rendering became the main cost.

**A hosted CMS from day one (rejected).** A CMS would have given a friendlier editing interface and draft states. I rejected it because one editor and about 300 entries do not justify the setup and extra failure points, and the `data/` functions keep a later move cheap: only they would change. I would reverse this if a second, non-technical editor joined, or the catalogue grew into the thousands.

## 8. How to Run

```
git clone <repository-url>
cd pc-games-catalogue
npm ci
npm run build
npm start
```

Then open http://localhost:3000. Do not use `npm run dev` to check rendering, because it renders every page on every request.
