import { normalizeStudy } from "./studyUtils";

export default function StudyCard({ study, showSummary }) {
  const s = normalizeStudy(study);

  return (
    <article className="card">
      <h2>{s.title}</h2>
      <p className="status">
        <span className={`badge badge-${s.statusColor}`}>{s.status}</span>
      </p>
      <p className="meta">
        <span>Phase: {s.phases.length ? s.phases.join(", ") : "Not listed"}</span>
        {" \u2009"}
        <span className="sep" aria-hidden="true">|</span>
        {" \u2009"}
        <span>Last updated: {s.updated ?? "Unknown"}</span>
      </p>
      <p className="locations">{s.places || "No location listed"}</p>

      {s.summary && (
        <details open={showSummary}>
          <summary>Study summary</summary>
          <p>{s.summary}</p>
        </details>
      )}

      {s.id && (
        <a
          href={`https://clinicaltrials.gov/study/${s.id}`}
          target="_blank"
          rel="noreferrer"
        >
          View original record ({s.id})
        </a>
      )}
    </article>
  );
}