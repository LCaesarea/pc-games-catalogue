import PageHeader from "../../../components/PageHeader";
import ProducedAt from "../../../components/ProducedAt";
import SearchPanel from "../../../components/SearchPanel";
import { getGames, getGenres } from "../../../data/games";

// A server component fetches from Strapi and passes the result down as props:
// the client component below cannot call data/ itself, because STRAPI_URL is not a NEXT_PUBLIC_ setting.
export default async function SearchPage() {
  const games = await getGames();
  const genres = getGenres(games);

  return (
    <>
      <PageHeader title="Search" intro="Filter the catalogue by title, genre or co-op support." />
      <ProducedAt strategy="static, produced once at build time" time={new Date().toISOString()} />
      <SearchPanel games={games} genres={genres} />
    </>
  );
}
