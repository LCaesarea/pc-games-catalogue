import Link from "next/link";
import PageHeader from "../components/PageHeader";
import ProducedAt from "../components/ProducedAt";
import ReleaseList from "../components/ReleaseList";
import { getGames } from "../data/games";
import { getReleases } from "../data/releases";

export default async function HomePage() {
  // Both collections, fetched once at build time.
  const [games, releases] = await Promise.all([getGames(), getReleases()]);

  return (
    <>
      <PageHeader
        title="PC Games Catalogue"
        intro={`A small, editor-curated catalogue of ${games.length} PC games from the last ten years.`}
      />
      <p>
        Browse the <Link href="/games">full catalogue</Link>, check <Link href="/new-releases">new releases</Link>,{" "}
        <Link href="/search">search by genre</Link>, or keep a <Link href="/wishlist">wishlist</Link>.
      </p>
      <ProducedAt strategy="static, produced once at build time" time={new Date().toISOString()} />
      {/* The same releases appear on /new-releases, which is server-side. Editing one in
          Strapi changes that page on the next reload and this one only after a rebuild. */}
      <ReleaseList
        heading="On the release calendar"
        releases={releases.slice(0, 3)}
        emptyMessage="No releases tracked."
      />
      <p>
        <Link href="/new-releases">See what is out now and what is coming up</Link>.
      </p>
    </>
  );
}
