# Demo run-sheet — the 15 checklist rows in order

Target 10 to 11 minutes; the hard limit is 12. You are a group of one, so write your own name in the Presenter column of every row, and say your name once at the start.

## Before you press record

Terminal 1 — Strapi, left running the whole time and **kept visible on screen**: it prints one line per request, which is the cleanest proof in rows 7 and 8.

```powershell
docker compose up -d
docker compose logs -f strapi        # wait for "Strapi started successfully", then Ctrl+C
```

Without Docker, that terminal is instead:

```powershell
npm run cms                          # leave it running; wait for "Strapi started successfully"
```

Either way Strapi answers on http://localhost:1337 and the rest of the demo is identical. Row 2 is the one row that needs the containers.

Terminal 2 — the site. **Stop any `npm start` that is already running first** (Ctrl+C in its terminal), or you will be looking at the previous build and wondering why nothing changed:

```powershell
Remove-Item -Recurse -Force .next
npm run build
npm start
```

Tabs to have open: http://localhost:3000, http://localhost:1337/admin (already signed in), http://localhost:1337/api/games?populate=cover, and VS Code with `ARCHITECTURE.md`.

Never `npm run dev` — row 5 asks the marker to see `next start` in the terminal.

---

## Row 1 — type check and linter (30s)

In a terminal that is not running the server:

```powershell
npx tsc --noEmit
npm run lint
```

Say: both finish with no output, so no errors and no warnings.

## Row 2 — containers and content (1m)

```powershell
docker compose ps
```

Two containers, `strapi` and `strapiDB`, both running. Then the admin at http://localhost:1337/admin → Content Manager → Game (300 entries) and Release (6). Scroll so the marker sees entries, and that each says **Published**.

If you are running Strapi with `npm run cms` instead, you cannot show containers. Show the `npm run cms` terminal and `docker-compose.yml` open in VS Code, and say: Strapi runs from the `cms/` project committed in this repository, the Compose file and `cms/Dockerfile` are in the repository too, and the marker's clone-and-run flow uses them. Then do the Content Manager half of the row as above. This is the only row Docker affects.

## Row 3 — the Public role (30s)

Settings → Users & Permissions → Roles → Public. Expand **Game**: `find` and `findOne` ticked, nothing else. Same for **Release**.

## Row 4 — the production build (1m)

```powershell
Remove-Item -Recurse -Force .next
npm run build
```

Read the route table out loud against Section 3 of `ARCHITECTURE.md`: `○` on `/`, `/games`, `/search`, `/wishlist` means static; `ƒ` on `/new-releases` means server-rendered on demand.

## Row 5 — the production server (20s)

```powershell
npm start
```

Point at the terminal: it says `next start`, not `next dev`. Open http://localhost:3000.

## Row 6 — navigation model (1m)

The claim: this is a single-page application. The proof: after the first page load, clicking a link never makes the browser ask for a new HTML document.

1. Open http://localhost:3000 and press **F12** → **Network** tab.
2. Tick **Preserve log** (top of the Network panel). Without it the list can clear under you.
3. Click the **Doc** filter button. That narrows the list to HTML document requests, which is exactly what row 6 is about.
4. Press **Ctrl+Shift+R** (hard reload). **One** row appears: name `localhost`, Type `document`, Status 200. Say: "that is the browser asking the server for a page — it happens once."
5. Now click through every route using the nav bar: **Games → New releases → Search → Wishlist → Home**. Watch the Doc list the whole time. **No new rows appear.** Say: "five routes, no new document request. In a multi-page application every one of those clicks would add a row here."
6. Switch the filter from **Doc** to **Fetch/XHR**. Now you see the requests navigation *does* make — URLs ending in `?_rsc=…`. Say: "Next.js fetches just the data for the next screen and swaps it in. That is the single-page part."
7. Finish the contrast: press **F5** while on any route, then look at **Doc** again. A second document row appears. Say: "that is what an MPA does on every click; here it only happens when I force a reload."

Two things that will otherwise confuse you on camera:

- `_rsc` requests can appear **before** you click, because Next prefetches links as they come into view. Harmless, and still not document requests.
- Make sure all five routes genuinely get visited — the row requires it.

## Row 7 — a static route that reads Strapi (45s)

Use **`/games`**. Two things have to land: Strapi's content is in the delivered HTML, and the page was produced once rather than per request.

1. On `/games`, press **Ctrl+U** for View Source. Say what this is: the HTML the server sent, before any JavaScript ran — not the Elements tab, which shows the live page afterwards.
2. **Ctrl+F** in that view and search `Hades`. Found. Search `Fight out of the Underworld` — the description text. Found. Say: "that text lives in Strapi, and it is already in the HTML, so a visitor with JavaScript switched off still sees the catalogue."
3. Search `Produced at` and read the timestamp aloud.
4. Back on the page, reload three times (**Ctrl+R**, three times), pointing at the Produced at line each time. It does not move. Say: "this HTML was produced once, when I ran `npm run build` — the timestamp is the build time."
5. The strongest proof is in Terminal 1: while you reload, **Strapi prints nothing**. No `GET /api/games` lines appear. Say: "the site isn't asking Strapi at all. It asked once, during the build."

## Row 8 — a server-side route that reads Strapi (45s)

Use **`/new-releases`**. Same two things, opposite answers.

1. **Ctrl+U** on `/new-releases`, **Ctrl+F** for `Planet Zoo 2`. Found — so this content comes from Strapi and is in the delivered HTML too. Say: "server-side rendering still sends finished HTML; the difference is when it is produced."
2. Search `Produced at`, note the time, then reload three times. **It changes every single time**, down to the second.
3. Terminal 1 again: each reload prints a new line, `http: GET /api/releases (4 ms) 200`. Say: "one request to Strapi per visit — three reloads, three lines. The static route printed none."
4. Say why this route and not the others: open `app/new-releases/page.tsx` and point at `export const dynamic = "force-dynamic"`. The page sorts releases into "out now" and "coming up" against today's date, which a build cannot know in advance.

## Row 9 — a client-side route (20s)

Write **N/A** in the checklist and say so out loud, with the reason: no route in the map is client-side rendered. Every route's content comes from Strapi through a server component.

**Do not offer `/wishlist` as the client-side example.** Its View Source *does* contain the game data — the server page passes the games to the client component as props, and those props are serialized into the HTML. If the marker searches `Hades` in `/wishlist` source, they will find it, and row 9 asks for text that is *not* in View Source. That would read as a wrong claim.

If you want to spend the twenty seconds showing the browser-side behaviour anyway, frame it accurately:

1. On `/games`, click **Save to wishlist** on one or two games.
2. Go to `/wishlist` — the saved cards appear.
3. **Ctrl+U** and **Ctrl+F** for `Loading your wishlist`. It is there. The saved cards are not.
4. Say: "the server had no way to know which games this visitor saved — that list lives in `localStorage` and is decided in the browser. The catalogue it picks from, though, came from Strapi at build time, so the route itself is static."

## Row 10 — a content change (1m 30s, the one to rehearse)

With `npm start` still running, in the admin open **Release → Planet Zoo 2**, change the **note**, click **Save**, then **Publish**.

- Reload `/new-releases` (server-side): the new text is there immediately.
- Reload `/` (static): the same release still shows the old text, because the page was built before the edit.

Then, in terminal 2: Ctrl+C to stop the server, and

```powershell
Remove-Item -Recurse -Force .next
npm run build
npm start
```

Reload both: now both show the new text. Say the sentence that explains it — a static route asks Strapi once, at build time; a server-side route asks on every request.

Afterwards, put the note back and re-export so the repository matches:

```powershell
docker compose exec strapi strapi export --no-encrypt --file seed/a2-content
```

## Row 11 — an image from Strapi (45s)

DevTools → Network → filter **Img** → reload `/games`. Click the first request: the URL is `/_next/image?url=http%3A%2F%2Flocalhost%3A1337%2Fuploads%2F…`, status 200. Then show the two commented settings in `next.config.ts` and say what `dangerouslyAllowLocalIP` is for and why it would be wrong on a deployed site.

## Row 12 — Lighthouse (1m)

Show Section 7 of `ARCHITECTURE.md` with your three scores and the median filled in, then run one Lighthouse report on `/games` in an incognito window against `npm start`. Name the Diagnostics item you wrote about and say whether Report 2's "Avoid an excessive DOM size, about 1,500 elements" prediction held.

## Row 13 — the difference between tags (1m)

```powershell
git diff --stat assignment1 assignment2 -- app components
```

Eight files. Walk the list against the table in Section 6 of `ARCHITECTURE.md`, and say which part of Report 1's prediction was right and which was wrong.

## Row 14 — changes since Report 2 (45s)

Section 4 of `ARCHITECTURE.md` on screen. The clearest one: Report 2 called `/wishlist` client-side, and it became static because a client component cannot call `data/` — `STRAPI_URL` is not a `NEXT_PUBLIC_` setting — so a server page fetches and passes the games down as props.

## Row 15 — one trade-off (45s)

Section 9 on screen. The strongest is content location: content moved out of `data/` into Strapi, which bought an editing interface, drafts and image uploads, and cost a build that now depends on Strapi running and a second system to run and back up. Say what would make you reverse it.
