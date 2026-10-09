const STATUS_INFO = {
  RECRUITING: { label: "Recruiting", color: "green" },
  NOT_YET_RECRUITING: { label: "Not yet recruiting", color: "blue" },
  ACTIVE_NOT_RECRUITING: { label: "Active, not recruiting", color: "amber" },
  ENROLLING_BY_INVITATION: { label: "Enrolling by invitation", color: "blue" },
  COMPLETED: { label: "Completed", color: "gray" },
  TERMINATED: { label: "Terminated", color: "red" },
  WITHDRAWN: { label: "Withdrawn", color: "red" },
  SUSPENDED: { label: "Suspended", color: "amber" },
  UNKNOWN: { label: "Unknown", color: "gray" },
};

function getStatusInfo(status) {
  if (!status) return { label: "Status unknown", color: "gray" };
  return (
    STATUS_INFO[status] ?? {
      // fallback for any code we didn't list: "SOME_CODE" -> "Some code"
      label: status.charAt(0) + status.slice(1).toLowerCase().replaceAll("_", " "),
      color: "gray",
    }
  );
}

export default function StudyCard({ study }) {
  const id = study.protocolSection?.identificationModule;
  const status = study.protocolSection?.statusModule?.overallStatus;
  const statusInfo = getStatusInfo(status);
  const locations = study.protocolSection?.contactsLocationsModule?.locations ?? [];

  const places = locations
    .slice(0, 3)
    .map((l) => [l.city, l.country].filter(Boolean).join(", "))
    .join(" · ");

  return (
    <article className="card">
      <h2>{id?.briefTitle ?? "Untitled study"}</h2>
      <span className={`badge badge-${statusInfo.color}`}>{statusInfo.label}</span>
      <p className="locations">{places || "No location listed"}</p>
    </article>
  );
}