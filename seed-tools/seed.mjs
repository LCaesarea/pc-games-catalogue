// Loads games.json, releases.json and covers/*.jpg into a running Strapi.
// Safe to run more than once: entries that already exist (same slug / code) are skipped.
//
//   $env:STRAPI_TOKEN = "<full-access API token from Strapi admin>"
//   node seed-tools/seed.mjs
//
// STRAPI_URL is read from .env.local (same file the Next.js app uses).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

function readEnvLocal() {
  try {
    const text = fs.readFileSync(path.join(root, ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  } catch {
    /* handled below */
  }
}
readEnvLocal();

const STRAPI_URL = process.env.STRAPI_URL;
const TOKEN = process.env.STRAPI_TOKEN;
if (!STRAPI_URL) {
  console.error("STRAPI_URL is missing. Put STRAPI_URL=http://localhost:1337 in .env.local and run again.");
  process.exit(1);
}
if (!TOKEN) {
  console.error(
    "STRAPI_TOKEN is missing. In Strapi admin: Settings > API Tokens > Create new (Full access), then set $env:STRAPI_TOKEN and run again.",
  );
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };

async function api(pathname, init = {}) {
  const url = `${STRAPI_URL}${pathname}`;
  const response = await fetch(url, { ...init, headers: { ...auth, ...(init.headers ?? {}) } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${init.method ?? "GET"} ${url} failed: ${response.status} ${response.statusText} ${body.slice(0, 300)}`);
  }
  return response.json();
}

async function existingKeys(collection, field) {
  const keys = new Set();
  for (let page = 1; ; page++) {
    const body = await api(
      `/api/${collection}?status=published&fields[0]=${field}&pagination[page]=${page}&pagination[pageSize]=100`,
    );
    for (const row of body.data) keys.add(row[field]);
    if (page >= body.meta.pagination.pageCount) break;
  }
  return keys;
}

async function uploadCover(game) {
  const file = path.join(here, "covers", `${game.slug}.jpg`);
  const form = new FormData();
  form.append("files", new Blob([fs.readFileSync(file)], { type: "image/jpeg" }), `${game.slug}.jpg`);
  form.append("fileInfo", JSON.stringify({ alternativeText: `Cover art for ${game.title}`, name: game.slug }));
  const body = await api("/api/upload", { method: "POST", body: form });
  return body[0].id;
}

// Retries once or twice: the first few parallel uploads can collide while
// Strapi is still creating its default media folder.
async function retry(work, attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await work();
    } catch (error) {
      if (attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }
}

async function inBatches(items, size, work) {
  // The first item runs on its own, so Strapi's default media folder exists
  // before anything runs in parallel.
  if (items.length > 0) await retry(() => work(items[0]));
  for (let i = 1; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map((item) => retry(() => work(item))));
  }
}

const games = JSON.parse(fs.readFileSync(path.join(here, "games.json"), "utf8"));
const releases = JSON.parse(fs.readFileSync(path.join(here, "releases.json"), "utf8"));

const haveGames = await existingKeys("games", "slug");
const todoGames = games.filter((g) => !haveGames.has(g.slug));
console.log(`Games: ${games.length - todoGames.length} already there, ${todoGames.length} to create.`);
let done = 0;
await inBatches(todoGames, 4, async (g) => {
  const cover = await uploadCover(g);
  await api("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        slug: g.slug,
        title: g.title,
        year: g.year,
        genres: g.genres.join(", "),
        coop: g.coop,
        rating: g.rating,
        description: g.description,
        cover,
      },
    }),
  });
  done++;
  if (done % 25 === 0) console.log(`  ${done}/${todoGames.length}`);
});

const haveReleases = await existingKeys("releases", "code");
for (const r of releases.filter((r) => !haveReleases.has(r.id))) {
  await api("/api/releases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { code: r.id, title: r.title, date: r.date, note: r.note } }),
  });
  console.log(`Release created: ${r.title}`);
}
console.log("Done. Check Content Manager: every entry should say Published.");
