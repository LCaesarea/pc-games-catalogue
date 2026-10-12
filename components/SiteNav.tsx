import Link from "next/link";

export default function SiteNav() {
  return (
    <nav className="site-nav">
      <Link href="/">Home</Link>
      <Link href="/games">Games</Link>
      <Link href="/new-releases">New releases</Link>
      <Link href="/search">Search</Link>
      <Link href="/wishlist">Wishlist</Link>
    </nav>
  );
}
