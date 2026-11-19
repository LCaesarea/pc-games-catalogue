// Runs the CMS on your own machine without Docker, on a SQLite file.
//
//   npm run cms:setup-local   (once)
//   npm run cms:import        loads seed/a2-content.tar.gz
//   npm run cms               starts Strapi on http://localhost:1337
//   npm run cms:export        writes the content back to seed/a2-content.tar.gz
//
// This changes no committed file. cms/.env still says postgres, for Docker;
// the two settings below are passed to this one process and win over .env,
// because dotenv never overwrites a variable that is already set.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cms = path.join(here, "..", "cms");
const windows = process.platform === "win32";

const commands = {
  develop: ["develop"],
  import: ["import", "--file", "seed/a2-content.tar.gz", "--force"],
  export: ["export", "--no-encrypt", "--file", "seed/a2-content"],
};

const name = process.argv[2] ?? "develop";
const args = commands[name];
if (args === undefined) {
  console.error(`Unknown command "${name}". Use develop, import or export.`);
  process.exit(1);
}

if (!fs.existsSync(path.join(cms, "node_modules", "@strapi", "strapi"))) {
  console.error("Strapi is not installed yet. Run: npm run cms:install");
  process.exit(1);
}

if (!fs.existsSync(path.join(cms, "node_modules", "better-sqlite3"))) {
  console.error(
    "The SQLite driver is not installed. Run this once:\n\n" +
      "  npm run cms:setup-local\n\n" +
      "It installs better-sqlite3 into cms/node_modules with --no-save, so the\n" +
      "provided cms/package.json and cms/package-lock.json stay untouched.\n" +
      "Docker does not need it: the container uses Postgres.",
  );
  process.exit(1);
}

const strapi = path.join(cms, "node_modules", "@strapi", "strapi", "bin", "strapi.js");

const child = spawn(process.execPath, [strapi, ...args], {
  cwd: cms,
  stdio: "inherit",
  env: { ...process.env, DATABASE_CLIENT: "sqlite", DATABASE_FILENAME: ".tmp/data.db" },
});

child.on("exit", (code) => process.exit(code ?? 0));
