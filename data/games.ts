import type { Game } from "./types";
import { fetchAllPages } from "./strapi";
import type { StrapiGame } from "./strapi";
import { toGame } from "./mapping";

// sort[0]=slug keeps Strapi's paging stable between requests; the A to Z order is applied afterwards.
export async function getGames(): Promise<Game[]> {
  const entries = await fetchAllPages<StrapiGame>("/api/games?populate=cover&sort[0]=slug");
  return entries.map(toGame).sort((a, b) => a.title.localeCompare(b.title));
}

export function getGenres(games: Game[]): string[] {
  return [...new Set(games.flatMap((game) => game.genres))].sort((a, b) => a.localeCompare(b));
}
