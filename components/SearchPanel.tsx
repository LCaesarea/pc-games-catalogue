"use client";
// Needs the browser: useState for the filters and change handlers. The games arrive as props from the server page.
import { useState } from "react";
import GameCard from "./GameCard";
import type { Game } from "../data/types";

type SearchPanelProps = {
  games: Game[];
  genres: string[];
};

export default function SearchPanel({ games, genres }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [coopOnly, setCoopOnly] = useState(false);

  const text = query.trim().toLowerCase();
  const results = games.filter(
    (game) =>
      (text === "" || game.title.toLowerCase().includes(text)) &&
      (genre === "" || game.genres.includes(genre)) &&
      (!coopOnly || game.coop),
  );

  return (
    <div className="search-panel">
      <div className="search-controls">
        <label>
          Title
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          Genre
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option value="">All genres</option>
            {genres.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={coopOnly} onChange={(event) => setCoopOnly(event.target.checked)} />
          Co-op only
        </label>
      </div>
      <p className="search-count">{results.length} games found</p>
      <div className="card-grid">
        {results.map((game, index) => (
          <GameCard key={game.slug} game={game} priority={index === 0} />
        ))}
      </div>
    </div>
  );
}
