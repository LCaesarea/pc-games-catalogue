import PageHeader from "../../../components/PageHeader";
import SearchPanel from "../../../components/SearchPanel";

export default function SearchPage() {
  return (
    <>
      <PageHeader title="Search" intro="Filter the catalogue by title, genre or co-op support." />
      <SearchPanel />
    </>
  );
}
