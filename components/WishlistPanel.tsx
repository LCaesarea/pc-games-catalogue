"use client";
// Needs the browser: localStorage holds this visitor's saved games, so the list is only produced after the page loads.
import GameCard from "./GameCard";
import { getGames } from "../data/games";
import { useWishlist } from "../lib/useWishlist";

export default function WishlistPanel() {
  const { slugs } = useWishlist();

  if (slugs === null) {
    return <p className="wishlist-placeholder">Loading your wishlist…</p>;
  }

  const saved = getGames().filter((game) => slugs.includes(game.slug));

  if (saved.length === 0) {
    return <p>Your wishlist is empty. Save games from the Games page.</p>;
  }

  return (
    <div className="card-grid">
      {saved.map((game) => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  );
}
