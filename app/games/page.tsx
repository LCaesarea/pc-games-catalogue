import PageHeader from "../../components/PageHeader";
import ProducedAt from "../../components/ProducedAt";
import GameCard from "../../components/GameCard";
import { getGames } from "../../data/games";

export default function GamesPage() {
  const games = getGames();

  return (
    <>
      <PageHeader title="Games" intro="Every game in the catalogue, A to Z." />
      <ProducedAt strategy="static, produced once at build time" time={new Date().toISOString()} />
      <div className="card-grid">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </>
  );
}
