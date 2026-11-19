# ARCHITECTURE.md

## 1. Group 10

| Name |
|Ackeem Thomas|


This is a group of one: I built and presented all of it.

## 2. Application

A catalogue of about 300 PC games from the last ten years, built for players deciding what to play next. Each entry has a title, release year, genre tags, whether it supports co-op, a short description, an editor's rating and a cover image. There is also a "new releases" list. I am the only editor: the game catalogue changes a few times a month and the releases list changes weekly. The content now lives in Strapi (running in Docker) and the Next.js app fetches it.

## 3. Route Map

| Route | What it shows | Strategy | When it asks Strapi | Why this moment | What it costs you | Proven by |
|---|---|---|---|---|---|---|
| `/` | Home page: links, the game count, and the three nearest releases | Static | Once, at build time, for both collections | Neither the count nor the calendar changes between my edits, and both are identical for every visitor. | Stale until the next build; the build now fails if Strapi is not running. | Produced-at time equals the build time and does not change on reload. Publishing a change to a release in Strapi leaves this page showing the old value while `/new-releases` shows the new one; a rebuild brings both into line. |
| `/games` | Every game with its cover | Static | Once, at build time | Changes a few times a month, on my schedule, identical for every visitor. | A game I publish in Strapi does not appear until I rebuild. | Produced-at time is fixed across reloads; stopping Strapi after the build does not break the page. |
| `/new-releases` | Games out now and coming up, based on today's date | Server-side | On every request | "Out now" versus "coming up" depends on today's date, which a build cannot know, and releases change weekly. | A server renders it on every request, and Strapi must be running for every visit. | Produced-at time changes on every reload; stopping Strapi makes the page fail while the static routes keep working. |
| `/search` | Filter games by title, genre or co-op | Static (page) + client-side filtering | Once, at build time | The catalogue is the same for every visitor, so the server page fetches it at build and passes it as props; only the filtering depends on the visitor. | The whole catalogue (about 300 entries) ships in the page for every visitor. | Produced-at time is fixed; View Source contains the games; typing in the filters changes the results with no network request to Strapi. |
| `/wishlist` | A visitor's saved games | Static (page) + client-side selection | Once, at build time | The catalogue is shared; which games are saved is per visitor and lives in `localStorage`. | Empty until JavaScript runs; saves live in one browser only. | Produced-at time is fixed; View Source shows only "Loading your wishlist…"; a second browser shows an empty list. |

Route table printed by `npm run build`

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

Navigation model: single-page application. Every link between routes uses `<Link>` from `next/link`, with no exceptions. This is separate from the rendering choices above.

## 4. Changes Since Report 2

| What Report 2 said | What I built | Why it changed |
|---|---|---|
| `/wishlist` is client-side. | `/wishlist` is a static page: a server page fetches the games from Strapi at build and passes them to `WishlistPanel` as props. | The wishlist needs the game data to show anything, and a client component cannot call `data/` (`STRAPI_URL` is not `NEXT_PUBLIC_`). The browser-only part is now just the choice of which saved games to show. |
| The route table had no "Produced at" on `/search` and `/wishlist`. | Both now show a "Produced at" line. | Both are static pages now, so the line proves it. |
| ESLint configuration unchanged. | `package.json` `browserslist` gained `not op_mini all`. | `eslint-plugin-compat` rejected `fetch` in `data/strapi.ts` because Opera Mini does not support it. Opera Mini is not a target for this site, and the check still covers every other browser. |
| Seed the 300 games by hand in the admin. | A script, `seed-tools/seed.mjs`, creates the entries and uploads the covers through Strapi's REST API, and the result is committed as a Strapi export. | Entering 300 games and covers by hand is not realistic; the script is safe to run twice, and the export means a fresh clone needs one import command. |
| Nothing said about where the CMS project lives. | The Lesson 4.1 `cms/` folder and `docker-compose.yml` are committed to this repository unchanged, except for the `- ./cms/seed:/opt/app/seed` volume the assignment asks for, and `cms/src/api/` now holding the two content types. | A clone has to come up on its own: `docker compose up -d --build`, import, run. Nothing is copied in by hand. |
| Strapi in Docker with Postgres, full stop. | Docker with Postgres stays the way the project is built and marked. The same CMS also runs on SQLite with `npm run cms`, for days when Docker is in the way. | The SQLite route changes no committed file: the driver is installed into `cms/node_modules` with `npm install --no-save`, and the database file sits in `cms/.tmp`, which git ignores. The same export loads into either, because an export holds entries, images and permissions rather than anything database-specific. |
| Games had no images. | Each game has a `cover` (Media, single image), shown with `next/image`. | Assignment 2 requires at least one Strapi image rendered with Strapi's own width and height. |
| The home page showed only a game count. | It also lists the three nearest releases. | Report 2 left every release on one route, so no single entry appeared on both a static and a server-side page. Publishing an edit now shows the difference between the two strategies on the same entry, which is what the demonstration has to prove. |

Everything else (content model, `data/strapi.ts` plus `data/mapping.ts`, two `next.config.ts` settings, paging in batches of 100) is as Report 2 planned.

## 5. Content Model

Both types were made in the Content-Type Builder; the `schema.json` files are committed under `cms/src/api/`.

**Game** (`cms/src/api/game/content-types/game/schema.json`)

| Field | Type | Required |
|---|---|---|
| `slug` | Text (short), unique | yes |
| `title` | Text (short) | yes |
| `year` | Number (integer) | yes |
| `genres` | Text (short), comma-separated, e.g. `Action, Roguelike` | yes |
| `coop` | Boolean | yes |
| `rating` | Number (decimal) | yes |
| `description` | Text (long) | yes |
| `cover` | Media (single image) | no |

**Release** (`cms/src/api/release/content-types/release/schema.json`)

| Field | Type | Required |
|---|---|---|
| `code` | Text (short), unique | yes |
| `title` | Text (short) | yes |
| `date` | Date | yes |
| `note` | Text (short) | yes |

`code` replaces A1's `id` because Strapi reserves `id`; `toRelease()` maps it back.

Both types were moved in full: Game (300 entries, each with a cover image) and Release (6 entries), 306 in all, and every one of them is Published — nothing is left as a draft. The Public role has `find` and `findOne` only, for both types, and nothing else. Because `cover` is a media field, requests ask for it with `populate=cover`.

`data/` no longer holds any content: `data/games.ts` and `data/releases.ts` are functions that fetch, and the arrays that used to sit in them are gone. The entries are committed as a Strapi export at `cms/seed/a2-content.tar.gz`, which carries the entries, the uploaded images and the role permissions.

## 6. Integration

`data/` is the only code that knows about Strapi:

| File | Role |
|---|---|
| `data/strapi.ts` | Reads `STRAPI_URL` (throws a named error if missing, no fallback), the exported response types (written from the real JSON, no `any`), and `fetchAllPages()`. |
| `data/mapping.ts` | `toGame()` (splits `genres`, builds `cover` from Strapi's `url`, `width`, `height`, `alternativeText`) and `toRelease()` (`code` becomes `id`). The only code that reads a property of a Strapi response type. |
| `data/games.ts`, `data/releases.ts` | `getGames()`, `getGenres(games)`, `getReleases()`. Return the app's own `Game` / `Release` types. |

Every `fetch` is called with the address only, checks `response.ok`, and throws naming the address and status. Strapi returns at most 100 entries per page — `maxLimit` in `cms/config/api.ts` — so `fetchAllPages()` loops until `pageCount`, with `sort[0]=slug` so the pages do not shuffle between requests. Asking for more proves the ceiling: `http://localhost:1337/api/games?pagination[pageSize]=101` answers with `"pageSize": 100` and `"pageCount": 3`, which is the 300 games in three requests that Report 2 predicted.

`STRAPI_URL` lives in `.env.local` (not `NEXT_PUBLIC_`); `.env.example` holds the one line `STRAPI_URL=http://localhost:1337`. Because of that, client components cannot call `data/`: the server pages `/search` and `/wishlist` fetch and pass `games` down as props.

| File | What changed and why |
|---|---|
| `app/page.tsx` | Now `async`, and awaits both `getGames()` and `getReleases()` in one `Promise.all`. The three nearest releases are listed here as well as on `/new-releases`, so one entry can be seen on a static route and a server-side route at the same time. |
| `app/games/page.tsx` | Now `async`; the first card gets `priority` because its cover is the likely-largest image above the fold. |
| `app/new-releases/page.tsx` | Now `async`; still `force-dynamic`. |
| `app/(tools)/search/page.tsx` | Now an `async` server page that fetches the games and genres and passes them to `SearchPanel`; gained a "Produced at" line. |
| `app/(tools)/wishlist/page.tsx` | Same pattern, passing `games` to `WishlistPanel`; gained a "Produced at" line. |
| `components/GameCard.tsx` | Shows the cover with `next/image`, using Strapi's width and height; `priority` is optional. |
| `components/SearchPanel.tsx` | Takes `games` and `genres` as props instead of calling `data/`, so the "Loading search…" placeholder and `useIsClient` are gone. |
| `components/WishlistPanel.tsx` | Takes `games` as props instead of calling `getGames()` in the browser. |

## 7. Images and Performance

Covers are a Strapi media field. `GameCard` renders them with `next/image` using Strapi's own `width` and `height`. `next.config.ts` has `remotePatterns` for `http://localhost:1337/uploads/**` and `dangerouslyAllowLocalIP: true`, each with a comment (the second explains why it is wrong on a deployed site).

`priority` (the likely-largest image per route): `/games` and `/search` give it to the first cover. `/` and `/new-releases` show no images, so they have none. `/wishlist` renders its cards only after JavaScript runs, so there is no above-the-fold image in the delivered HTML and no `priority`.

Lighthouse: measured in an incognito Chrome window against `npm start` (after deleting `.next` and running `npm run build`), three runs per route, median reported.

| Route | Run 1 | Run 2 | Run 3 | Median |
|---|---|---|---|---|
| `/games` | [ ] | [ ] | [ ] | [ ] |


## 8. Components and Layouts

```
app/layout.tsx            (root layout: SiteNav + <main>, wraps every route)
├── app/page.tsx                      /
├── app/games/page.tsx                /games
├── app/new-releases/page.tsx         /new-releases
└── app/(tools)/layout.tsx            (nested layout: browser-tools banner)
    ├── app/(tools)/search/page.tsx   /search
    └── app/(tools)/wishlist/page.tsx /wishlist
```

Components (`components/`): `SiteNav`, `PageHeader` (all routes), `ProducedAt` (all routes), `GameCard` (`/games`, `/search`, `/wishlist`), `ReleaseList` (`/`, `/new-releases`), `WishlistButton`, `SearchPanel`, `WishlistPanel`.

`'use client'` files:

| File | Why it needs the browser |
|---|---|
| `components/WishlistButton.tsx` | `localStorage` for the saved list and a click handler. |
| `components/SearchPanel.tsx` | State for the filters and change handlers. The games arrive as props. |
| `components/WishlistPanel.tsx` | `localStorage` decides which of the passed-in games to show. |

Helper hook in `lib/`: `useWishlist`, only imported by the client files. Stylesheet: `app/globals.css`, with every rule scoped under `.pcg`.

## 9. Trade-offs

**`/games` asked on every request (rejected).** Fetching from Strapi on every visit would show a new game the moment I publish it, with no rebuild. I rejected it because the catalogue changes a few times a month, so almost every request would repeat the same 300-entry answer; it would cost a server and a running Strapi for every visit. I would reverse this if I published several times a day, or if rebuilding became a chore I kept forgetting.

**Server-side `/search` (rejected).** Filtering on the server would send only matching games to each visitor, so the page would be small. I rejected it because every keystroke would need a request, and the delivered page would be a form with no results until the server answered. The catalogue is small enough to ship once and filter in the browser. I would reverse this if the catalogue grew into the thousands, where shipping all of it becomes the main cost.

**Content location: a CMS now, rather than files in `data/` (accepted).** Moving content to Strapi gives me an editing interface, drafts and image uploads, and the `data/` functions kept the move to one layer. The cost is that the build now depends on Strapi running, and there are two systems to run and back up rather than one repository.

**Database: Postgres in Docker, with SQLite as a second way to run the same CMS (accepted).** Strapi supports PostgreSQL, MySQL/MariaDB and SQLite, and no NoSQL database, so MongoDB was never an option. Postgres in the provided Compose setup is how the project is built, demonstrated and marked: a clone comes up with one command and every machine gets the same database. SQLite is there for days when Docker is in the way — one file, no server — and it changes nothing that is committed, because the driver is installed into `cms/node_modules` with `--no-save` and the database file lives in the ignored `cms/.tmp`. The same `a2-content.tar.gz` loads into either, since an export holds entries, images and permissions rather than anything database-specific. The cost is two ways of running one thing, so Section 10 documents both and I tested both.

## 10. How to Run

You need Docker Desktop and Node.js 22 or newer. Only one Strapi can run at a time.

The import brings in 300 games with their covers, 6 releases, and the Public role's `find` and `findOne` permissions, so no setting has to be clicked by hand. It does not contain an admin account: the first visit to http://localhost:1337/admin asks you to create one.

### With Docker and Postgres (how the project is built and marked)

```
git clone --branch assignment2 <repository-url> a2-check
cd a2-check
npm ci
Copy-Item .env.example .env.local
docker compose up -d --build
docker compose exec strapi strapi import --file seed/a2-content.tar.gz --force
docker compose restart strapi
npx tsc --noEmit
npm run lint
npm run build
npm start
```

The first `docker compose up -d --build` takes several minutes: it pulls `node:22-slim` and `postgres:16-alpine`, installs Strapi from the committed lock file, and pre-builds the admin panel. `docker compose logs -f strapi` shows when it prints `Strapi started successfully`. If another project's Strapi is up, run `docker compose down` there first — never `-v`, which deletes the database volume.

### Without Docker, on SQLite (optional, for working on it)

```
npm ci
npm run cms:install      # Strapi, from the provided package-lock.json
npm run cms:setup-local  # once: adds the SQLite driver to cms/node_modules only
npm run cms:import
npm run cms              # leave running: Strapi on http://localhost:1337
```

Then `npm run build` and `npm start` in a second terminal. `npm run cms:setup-local` installs with `--no-save`, so the provided `cms/package.json` and `cms/package-lock.json` are untouched; the database is `cms/.tmp/data.db`, which git ignores. `npm run cms:export` writes the content back out.

What runs where:

| Piece | Where | Address |
|---|---|---|
| Next.js front end | Your machine, `npm start` | http://localhost:3000 |
| Strapi 5.52.1 | Docker service `strapi`, built from `cms/Dockerfile`; or `npm run cms` | http://localhost:1337 |
| Database | Docker service `strapiDB` (Postgres 16) with the named volume `strapi-data`; or `cms/.tmp/data.db` | Postgres is published on 5432 so a database tool can look at it; Strapi reaches it by the service name `strapiDB` over the compose network |

Settings live in `cms/.env`, which `docker-compose.yml` both reads (`env_file`) and mounts into the container. `DATABASE_HOST` there is `strapiDB`, the compose service name, and the three database credentials match `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` in the compose file.

After any change in the admin, re-export so the repository matches what you see:

```
docker compose exec strapi strapi export --no-encrypt --file seed/a2-content
npm run cms:export    # the no-Docker equivalent
```

Do not use `npm run dev` to check rendering, because it renders every page on every request.
