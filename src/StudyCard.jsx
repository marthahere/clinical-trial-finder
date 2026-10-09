export default function StudyCard({ study }) {
  const id = study.protocolSection?.identificationModule;
  const status = study.protocolSection?.statusModule?.overallStatus;
  const locations = study.protocolSection?.contactsLocationsModule?.locations ?? [];

  const places = locations
    .slice(0, 3)
    .map((l) => [l.city, l.country].filter(Boolean).join(", "))
    .join(" · ");

  return (
    <article className="card">
      <h2>{id?.briefTitle ?? "Untitled study"}</h2>
      <p className="status">{status ?? "Status unknown"}</p>
      <p className="locations">{places || "No location listed"}</p>
    </article>
  );
}