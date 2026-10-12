export type Game = {
  slug: string;
  title: string;
  year: number;
  genres: string[];
  coop: boolean;
  rating: number; // editor's score out of 10
  description: string;
};

export type Release = {
  id: string;
  title: string;
  date: string; // ISO date, YYYY-MM-DD
  note: string;
};
