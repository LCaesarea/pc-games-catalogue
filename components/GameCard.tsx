import type { Game } from "../data/types";
import WishlistButton from "./WishlistButton";

type GameCardProps = {
  game: Game;
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <article className="game-card">
      <h3>{game.title}</h3>
      <p className="game-meta">
        {game.year} · {game.genres.join(", ")} · {game.coop ? "Co-op" : "No co-op"} · {game.rating}/10
      </p>
      <p>{game.description}</p>
      <WishlistButton slug={game.slug} />
    </article>
  );
}
