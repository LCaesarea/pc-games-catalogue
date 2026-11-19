// The only place that knows Strapi's address and the shape of its responses.

const configured = process.env.STRAPI_URL;

if (configured === undefined || configured === "") {
  throw new Error(
    "STRAPI_URL is missing. Copy .env.example to .env.local (Copy-Item .env.example .env.local), make sure Strapi is running (npm run cms, or docker compose up -d), then run this command again.",
  );
}

export const STRAPI_URL: string = configured;

// Response types below were written from the real JSON of
// GET /api/games?populate=cover and GET /api/releases (Strapi 5, Public role).

export type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiCollectionResponse<T> = {
  data: T[];
  meta: { pagination: StrapiPagination };
};

export type StrapiImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

export type StrapiImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: string | null;
  width: number;
  height: number;
  formats: Record<string, StrapiImageFormat> | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiGame = {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  year: number;
  genres: string; // comma-separated, e.g. "Action, Roguelike"
  coop: boolean;
  rating: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover: StrapiImage | null;
};

export type StrapiRelease = {
  id: number;
  documentId: string;
  code: string;
  title: string;
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

const PAGE_SIZE = 100; // Strapi's maximum page size

// Strapi returns one page at a time, so a collection bigger than PAGE_SIZE needs several requests.
export async function fetchAllPages<T>(path: string): Promise<T[]> {
  const rows: T[] = [];

  for (let page = 1; ; page++) {
    const address = `${STRAPI_URL}${path}${path.includes("?") ? "&" : "?"}pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;

    let response: Response;
    try {
      response = await fetch(address);
    } catch {
      throw new Error(
        `Could not reach Strapi at ${address}. Is it running? Start it with: npm run cms (or docker compose up -d).`,
      );
    }

    if (!response.ok) {
      const hint =
        response.status === 403
          ? " The Public role is missing find/findOne for this type (Settings > Users & Permissions > Roles > Public)."
          : "";
      throw new Error(`Strapi request failed: ${address} returned ${response.status} ${response.statusText}.${hint}`);
    }

    const body = (await response.json()) as StrapiCollectionResponse<T>;
    rows.push(...body.data);

    if (page >= body.meta.pagination.pageCount) {
      return rows;
    }
  }
}
