# START HERE

Extract, run the commands below, done. Nothing has to be copied in from the Lesson 4.1 zip: `cms/` and `docker-compose.yml` are already here.

## 0. Do this first

Open `ARCHITECTURE.md` and fill in **Section 1 Group** with your full name and student number. The feedback on Report 2 said the section on the first page was the one gap; do not leave the square brackets in.

## 1. What came from Lesson 4.1, and what I changed

Every provided file is in this project byte for byte as the lesson supplied it. Check it yourself against your copy of the zip if you like:

| Provided file | State |
|---|---|
| `cms/Dockerfile` | unchanged |
| `cms/package.json`, `cms/package-lock.json` | unchanged (Strapi 5.52.1) |
| `cms/config/*.ts` (all six) | unchanged |
| `cms/tsconfig.json`, `cms/src/index.ts`, `cms/src/admin/*` | unchanged |
| `cms/public/robots.txt` | unchanged |
| `docker-compose.yml` | **one addition**: `- ./cms/seed:/opt/app/seed` under the strapi volumes, which Assignment 2 asks for |
| `cms/.env` | written to match the compose file (`DATABASE_HOST=strapiDB`, and the three credentials match `POSTGRES_*`). If your zip has its own `.env`, either works — keep whichever you prefer. |
| `cms/src/api/` | filled with the Game and Release content types, which is what Step 5 of the lesson fills it with |
| `cms/.gitignore` | two lines added at the bottom, with comments: one so the content export is committed despite `*.gz`, one so `cms/.env` is committed (a rule here beats `!cms/.env` in the root `.gitignore`, because the deeper file wins) |

The four files the lesson said you write yourself are written: `data/strapi.ts`, `tsconfig.json` (excludes `cms`), `eslint.config.mjs` (ignores `cms/**`) and `.gitignore` (the ten Strapi lines).

## 2. Run it with Docker — this is the flow you are marked by

You need Docker Desktop running and Node.js. If another project's Strapi is up, run `docker compose down` there first. Never `-v`: that deletes the database.

```powershell
npm ci
docker compose up -d --build
```

The first build downloads the Node and Postgres images, installs Strapi and pre-builds the admin panel, so give it several minutes. `docker compose logs -f strapi` shows when it prints `Strapi started successfully` (Ctrl+C stops watching, not the container).

```powershell
docker compose exec strapi strapi import --file seed/a2-content.tar.gz --force
docker compose restart strapi
npm run build
npm start
```

- Site: http://localhost:3000
- Strapi admin: http://localhost:1337/admin — the first visit asks you to create the admin account, because an export deliberately does not contain one
- The API the site uses: http://localhost:1337/api/games?populate=cover

The import brings in 300 games with covers, 6 releases, and the Public role's `find` and `findOne` permissions, so nothing has to be ticked by hand.

`.env.local` is already here, so `npm run build` works straight away. It is ignored by git on purpose; `.env.example` is the copy that gets committed.

After any change in the admin, write it back to the repository and commit it:

```powershell
docker compose exec strapi strapi export --no-encrypt --file seed/a2-content
```

## 3. Running it without Docker (optional)

Same CMS, same content, on a SQLite file instead of Postgres in a container. Useful when you just want the site up, and for recording the demo without Docker Desktop in the way. Run this once:

```powershell
npm run cms:install      # installs Strapi from the provided package-lock.json
npm run cms:setup-local  # adds the SQLite driver to cms/node_modules only
```

Then, any time:

```powershell
npm run cms:import   # loads the same seed/a2-content.tar.gz
npm run cms          # Strapi on http://localhost:1337 — leave this running
```

and in a second terminal, `npm run build` and `npm start`. `npm run cms:export` writes the content back out.

`cms:setup-local` uses `npm install --no-save`, so the provided `cms/package.json` and `cms/package-lock.json` are not touched; the driver only lands in `cms/node_modules`, which git ignores. The database is `cms/.tmp/data.db`, also ignored. Docker is unaffected and still uses Postgres.

Run Docker or this, not both: they both want port 1337.

## 4. Check the three gates before you submit

```powershell
npx tsc --noEmit        # prints nothing
npm run lint            # no errors, no warnings
Remove-Item -Recurse -Force .next
npm run build           # prints the route table
npm start
```

## 5. Git

This continues the Assignment 1 repository, so copy these files into your existing A1 repo folder (keep its `.git`) rather than starting a new repository, then:

```powershell
git add -A
git commit -m "Assignment 2: content moved into Strapi"
git tag assignment2
git push origin main --tags
```

Keep the `assignment1` tag. The instructor stays a Reporter on the project. Two files have to be in the commit despite looking like the sort of thing git skips — check both print a path:

```powershell
git ls-files cms/seed/a2-content.tar.gz
git ls-files cms/.env
```

## 6. Rehearse the marker's run

```powershell
docker compose down          # in this project, no -v
cd ..
git clone --branch assignment2 <your repo url> a2-check
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

If that works end to end, the reproducibility part of the rubric is covered. If it fails for the marker, Routes and Rendering is capped at 5 of 10, so it is worth the twenty minutes.

## 7. What you still have to produce yourself

- **ARCHITECTURE.md Section 1**: your name and student number (see step 0).
- **ARCHITECTURE.md Section 3**: paste the route table your own `npm run build` prints.
- **ARCHITECTURE.md Section 6**: paste your own `git diff --stat assignment1 assignment2 -- app components`. It should list the same 8 files already explained there.
- **ARCHITECTURE.md Section 7**: Lighthouse. Incognito Chrome, against `npm start`, three runs on `/games`, the median, one Diagnostics item explained, and whether Report 2's "Avoid an excessive DOM size, about 1,500 elements" prediction held. I left these blank rather than invent numbers.
- **The Demonstration Checklist**: fill in the group number, both URLs, your Assignment 1 tag (`assignment1`), the video length, and your own name in the Presenter column of all 15 rows. Row 9 is **N/A** — no route in the map is client-side rendered. `seed-tools/DEMO-RUN-SHEET.md` walks the 15 rows in order with the exact commands.

## 8. About Vercel

Nothing needs deploying: the marker clones, runs `npm start` and measures Lighthouse against localhost, and `next.config.ts` is written for a Strapi on `localhost:1337`. If you want it on Vercel afterwards, four things change:

1. Strapi needs a public home (Strapi Cloud, Railway, Render). Vercel runs the Next.js app only; it cannot host the Strapi container or its Postgres.
2. Set `STRAPI_URL` to that address in the Vercel project's Environment Variables. Nothing in `data/` changes.
3. In `next.config.ts`, change the `remotePatterns` entry to `protocol: "https"` with that hostname, and **delete `dangerouslyAllowLocalIP`**. It exists only because Strapi is on localhost here; on a deployed site it lets the image optimizer reach private addresses.
4. The static routes are built at deploy time, so publishing a game in Strapi will not appear until the next deployment. A Strapi webhook pointing at a Vercel deploy hook fixes that — but it changes the rendering story in `ARCHITECTURE.md`, so do it after you are marked.

## 9. If something goes wrong

| Problem | Fix |
|---|---|
| Port 1337 already in use | Another Strapi is running — a container, or `npm run cms`. Stop it (`docker compose down`, no `-v`). |
| Port 5432 already in use | You have PostgreSQL installed on the machine. In `docker-compose.yml`, change the strapiDB ports line to `"5433:5432"`. Only the left number. |
| Build fails with "Could not reach Strapi" | Strapi is not up. `docker compose ps` and `docker compose logs strapi`, or check the `npm run cms` terminal. |
| Build fails with "STRAPI_URL is missing" | `Copy-Item .env.example .env.local` |
| `/api/games` returns 403 | The Public role lost its permissions. Settings > Users & Permissions > Roles > Public: tick `find` and `findOne` for Game and Release only, Save. |
| Strapi starts but the catalogue is empty | It was started before the import. Run the import, then `docker compose restart strapi`. |
| The import fails or the content looks wrong | Rebuild it: in the admin create a Full access API token (Settings > API Tokens), then `$env:STRAPI_TOKEN = "<token>"` and `node seed-tools/seed.mjs`. It recreates all 300 games, the covers and the 6 releases from the JSON in `seed-tools/`, is safe to run twice, and takes about 30 seconds. Export afterwards. |

## 10. Things worth knowing

- The 6 releases all have October 2026 dates, so today they all appear under "Out now" and "Coming up" is empty. If you want both lists filled for the video, edit a couple of dates in the admin, publish, and re-export. The dates came from release calendars and are worth re-checking.
- The cover images are generated placeholder art (the title on a coloured gradient), not real box art, so there is no copyright question in the submission.
- `seed-tools/` is excluded from TypeScript and ESLint, so nothing in it can break the gates.
- `http://localhost:1337/api/games?pagination[pageSize]=101` answers with `pageSize: 100` and `pageCount: 3`. That is `maxLimit` in the provided `cms/config/api.ts`, and it is the Report 2 claim about three pages, demonstrable in one URL.
