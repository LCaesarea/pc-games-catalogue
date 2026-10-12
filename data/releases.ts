import type { Release } from "./types";

// Dates come from third-party release calendars; verify them before relying on them.
const releases: Release[] = [
  { id: "gears-of-war-e-day", title: "Gears of War: E-Day", date: "2026-10-06", note: "Third-person shooter, on PC at launch." },
  { id: "planet-zoo-2", title: "Planet Zoo 2", date: "2026-10-13", note: "Zoo-building sequel." },
  { id: "enshrouded-1-0", title: "Enshrouded 1.0", date: "2026-10-15", note: "Survival game leaving early access." },
  { id: "castlevania-belmonts-curse", title: "Castlevania: Belmont's Curse", date: "2026-10-15", note: "New entry in the Castlevania series." },
  { id: "call-of-duty-mw4", title: "Call of Duty: Modern Warfare 4", date: "2026-10-23", note: "Annual first-person shooter." },
  { id: "phantom-blade-zero", title: "Phantom Blade Zero", date: "2026-10-29", note: "Action game." },
];

export function getReleases(): Release[] {
  return [...releases].sort((a, b) => a.date.localeCompare(b.date));
}
