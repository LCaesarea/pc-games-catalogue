import PageHeader from "../../../components/PageHeader";
import WishlistPanel from "../../../components/WishlistPanel";

export default function WishlistPage() {
  return (
    <>
      <PageHeader title="Wishlist" intro="Games you saved in this browser." />
      <WishlistPanel />
    </>
  );
}
