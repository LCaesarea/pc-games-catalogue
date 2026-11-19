import type { Release } from "./types";
import { fetchAllPages } from "./strapi";
import type { StrapiRelease } from "./strapi";
import { toRelease } from "./mapping";

export async function getReleases(): Promise<Release[]> {
  const entries = await fetchAllPages<StrapiRelease>("/api/releases?sort[0]=date");
  return entries.map(toRelease);
}
