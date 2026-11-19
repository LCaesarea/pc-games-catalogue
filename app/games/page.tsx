import PageHeader from "../../components/PageHeader";
import ProducedAt from "../../components/ProducedAt";
import GameCard from "../../components/GameCard";
import { getGames } from "../../data/games";

export default async function GamesPage() {
  const games = await getGames();

  return (
    <>
      <PageHeader title="Games" intro="Every game in the catalogue, A to Z." />
      <ProducedAt strategy="static, produced once at build time" time={new Date().toISOString()} />
      <div className="card-grid">
        {games.map((game, index) => (
          // The first cover is the likely-largest image above the fold, so it is loaded eagerly.
          <GameCard key={game.slug} game={game} priority={index === 0} />
        ))}
      </div>
    </>
  );
}
