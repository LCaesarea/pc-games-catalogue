import PageHeader from "../../components/PageHeader";
import ProducedAt from "../../components/ProducedAt";
import ReleaseList from "../../components/ReleaseList";
import { getReleases } from "../../data/releases";

export const dynamic = "force-dynamic";

export default function NewReleasesPage() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const releases = getReleases();
  const outNow = releases.filter((release) => release.date <= today);
  const comingUp = releases.filter((release) => release.date > today);

  return (
    <>
      <PageHeader title="New releases" intro="What is out now and what is coming up, based on today's date." />
      <ProducedAt strategy="server-side, produced on every request" time={now.toISOString()} />
      <ReleaseList heading="Out now" releases={outNow} emptyMessage="Nothing tracked as released yet." />
      <ReleaseList heading="Coming up" releases={comingUp} emptyMessage="No upcoming releases tracked." />
    </>
  );
}
