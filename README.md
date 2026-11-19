# PC Games Catalogue — INFT 3102 Assignment 2

A catalogue of about 300 PC games. The content lives in Strapi 5 (Docker + Postgres, in `cms/`) and the Next.js 16 front end fetches it through `data/`.

<<<<<<< HEAD
Setup: **`seed-tools/START-HERE.md`**. Design and route map: **`ARCHITECTURE.md`**.

```powershell
npm ci
docker compose up -d --build
docker compose exec strapi strapi import --file seed/a2-content.tar.gz --force
docker compose restart strapi
=======
git clone <repository-url>
cd pc-games-catalogue
npm ci
>>>>>>> cebb0e84628201b94887d3491a980270ed8a88c5
npm run build
npm start
```
