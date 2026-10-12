"use client";
// Needs the browser: localStorage holds the saved list, and the button has a click handler.
import { useWishlist } from "../lib/useWishlist";

type WishlistButtonProps = {
  slug: string;
};

export default function WishlistButton({ slug }: WishlistButtonProps) {
  const { slugs, toggle } = useWishlist();
  const saved = slugs !== null && slugs.includes(slug);

  return (
    <button
      type="button"
      className="wishlist-button"
      disabled={slugs === null}
      onClick={() => toggle(slug)}
    >
      {saved ? "Remove from wishlist" : "Save to wishlist"}
    </button>
  );
}
