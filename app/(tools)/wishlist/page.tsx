import PageHeader from "../../../components/PageHeader";
import ProducedAt from "../../../components/ProducedAt";
import WishlistPanel from "../../../components/WishlistPanel";
import { getGames } from "../../../data/games";

// Static: the catalogue is fetched from Strapi at build time and passed down as props.
// Which games are saved is decided in the browser, from localStorage, inside WishlistPanel.
export default async function WishlistPage() {
  const games = await getGames();

  return (
    <>
      <PageHeader title="Wishlist" intro="Games you saved in this browser." />
      <ProducedAt strategy="static, produced once at build time" time={new Date().toISOString()} />
      <WishlistPanel games={games} />
    </>
  );
}
