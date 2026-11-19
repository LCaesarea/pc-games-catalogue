// What the rest of the app works with. These are the app's own types: nothing outside data/ sees Strapi's field names.
export type Cover = {
  src: string; // full address, e.g. http://localhost:1337/uploads/hades_ab12.jpg
  width: number; // from Strapi, so next/image can reserve the space
  height: number;
  alt: string;
};

export type Game = {
  slug: string;
  title: string;
  year: number;
  genres: string[];
  coop: boolean;
  rating: number; // editor's score out of 10
  description: string;
  cover?: Cover;
};

export type Release = {
  id: string;
  title: string;
  date: string; // ISO date, YYYY-MM-DD
  note: string;
};
