import type { Release } from "../data/types";

type ReleaseListProps = {
  heading: string;
  releases: Release[];
  emptyMessage: string;
};

export default function ReleaseList({ heading, releases, emptyMessage }: ReleaseListProps) {
  return (
    <section className="release-list">
      <h2>{heading}</h2>
      {releases.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {releases.map((release) => (
            <li key={release.id}>
              <strong>{release.title}</strong> <span className="release-date">{release.date}</span>
              <br />
              {release.note}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
