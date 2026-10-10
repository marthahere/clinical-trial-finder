export default function StudyCard({ study }) {
  const p = study.protocolSection;
  const id = p?.identificationModule;
  const status = p?.statusModule?.overallStatus;
  const updated = p?.statusModule?.lastUpdatePostDateStruct?.date;
  const phases = p?.designModule?.phases ?? [];
  const summary = p?.descriptionModule?.briefSummary;
  const locations = p?.contactsLocationsModule?.locations ?? [];

  const places = locations
    .slice(0, 3)
    .map((l) => [l.city, l.country].filter(Boolean).join(", "))
    .join(" · ");

  return (
    <article className="card">
      <h2>{id?.briefTitle ?? "Untitled study"}</h2>
      <p className="status">{status ?? "Status unknown"}</p>
      <p className="meta">
        Phase: {phases.length ? phases.join(", ") : "Not listed"} · Last
        updated: {updated ?? "Unknown"}
      </p>
      <p className="locations">{places || "No location listed"}</p>

      {summary && (
        <details>
          <summary>Study summary</summary>
          <p>{summary}</p>
        </details>
      )}

      {id?.nctId && (
        <a
          href={`https://clinicaltrials.gov/study/${id.nctId}`}
          target="_blank"
          rel="noreferrer"
        >
          View original record ({id.nctId})
        </a>
      )}
    </article>
  );
}