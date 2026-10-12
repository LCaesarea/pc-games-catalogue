import Link from "next/link";
import PageHeader from "../components/PageHeader";
import ProducedAt from "../components/ProducedAt";
import { getGames } from "../data/games";

export default function HomePage() {
  const total = getGames().length;

  return (
    <>
      <PageHeader
        title="PC Games Catalogue"
        intro={`A small, editor-curated catalogue of ${total} PC games from the last ten years.`}
      />
      <p>
        Browse the <Link href="/games">full catalogue</Link>, check <Link href="/new-releases">new releases</Link>,{" "}
        <Link href="/search">search by genre</Link>, or keep a <Link href="/wishlist">wishlist</Link>.
      </p>
      <ProducedAt strategy="static, produced once at build time" time={new Date().toISOString()} />
    </>
  );
}
