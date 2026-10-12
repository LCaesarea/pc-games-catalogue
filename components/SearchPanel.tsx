"use client";
// Needs the browser: useState for the filters, change handlers, and results that are only produced after the page loads.
import { useState } from "react";
import GameCard from "./GameCard";
import { getGames, getGenres } from "../data/games";
import { useIsClient } from "../lib/useIsClient";

export default function SearchPanel() {
  const isClient = useIsClient();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [coopOnly, setCoopOnly] = useState(false);

  if (!isClient) {
    return <p className="search-placeholder">Loading search…</p>;
  }

  const text = query.trim().toLowerCase();
  const results = getGames().filter(
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
            {getGenres().map((name) => (
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
        {results.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
