# PC Games Catalogue — INFT 3102 Assignment 2

A catalogue of about 300 PC games. The content lives in Strapi 5 (Docker + Postgres, in `cms/`) and the Next.js 16 front end fetches it through `data/`.

Setup: **`seed-tools/START-HERE.md`**. Design and route map: **`ARCHITECTURE.md`**.

```powershell
npm ci
docker compose up -d --build
docker compose exec strapi strapi import --file seed/a2-content.tar.gz --force
docker compose restart strapi
npm run build
npm start
```
