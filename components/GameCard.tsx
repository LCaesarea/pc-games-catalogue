import Image from "next/image";
import type { Game } from "../data/types";
import WishlistButton from "./WishlistButton";

type GameCardProps = {
  game: Game;
  priority?: boolean;
};

export default function GameCard({ game, priority = false }: GameCardProps) {
  return (
    <article className="game-card">
      {game.cover && (
        <Image
          src={game.cover.src}
          width={game.cover.width}
          height={game.cover.height}
          alt={game.cover.alt}
          sizes="(max-width: 600px) 100vw, 240px"
          style={{ width: "100%", height: "auto" }}
          priority={priority}
        />
      )}
      <h3>{game.title}</h3>
      <p className="game-meta">
        {game.year} · {game.genres.join(", ")} · {game.coop ? "Co-op" : "No co-op"} · {game.rating}/10
      </p>
      <p>{game.description}</p>
      <WishlistButton slug={game.slug} />
    </article>
  );
}
