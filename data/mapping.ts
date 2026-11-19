// The only code that reads properties of Strapi response types.
import type { Game, Release } from "./types";
import { STRAPI_URL } from "./strapi";
import type { StrapiGame, StrapiRelease } from "./strapi";

export function toGame(entry: StrapiGame): Game {
  const game: Game = {
    slug: entry.slug,
    title: entry.title,
    year: entry.year,
    // Strapi stores the genres as one comma-separated text field.
    genres: entry.genres
      .split(",")
      .map((genre) => genre.trim())
      .filter((genre) => genre !== ""),
    coop: entry.coop,
    // Number() guards against a database that hands decimals back as strings.
    rating: Number(entry.rating),
    description: entry.description,
  };

  if (entry.cover !== null) {
    game.cover = {
      src: `${STRAPI_URL}${entry.cover.url}`,
      width: entry.cover.width,
      height: entry.cover.height,
      alt: entry.cover.alternativeText ?? `Cover art for ${entry.title}`,
    };
  }

  return game;
}

export function toRelease(entry: StrapiRelease): Release {
  return {
    id: entry.code, // Strapi reserves "id" for its own number, so the field is called "code" there
    title: entry.title,
    date: entry.date,
    note: entry.note,
  };
}
