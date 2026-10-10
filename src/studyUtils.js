const STATUS_COLORS = {
  RECRUITING: "green",
  NOT_YET_RECRUITING: "blue",
  ACTIVE_NOT_RECRUITING: "amber",
  ENROLLING_BY_INVITATION: "blue",
  COMPLETED: "gray",
  TERMINATED: "red",
  WITHDRAWN: "red",
  SUSPENDED: "amber",
  UNKNOWN: "gray",
};

const PHASE_LABELS = {
  EARLY_PHASE1: "Early Phase 1",
  PHASE1: "1",
  PHASE2: "2",
  PHASE3: "3",
  PHASE4: "4",
  NA: "N/A",
};

function formatStatus(raw) {
  if (!raw) return "Status unknown";
  const text = raw.toLowerCase().replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPhase(raw) {
  return PHASE_LABELS[raw] ?? raw;
}

export function normalizeStudy(study) {
  const p = study?.protocolSection ?? {};
  const locations = Array.isArray(p.contactsLocationsModule?.locations)
    ? p.contactsLocationsModule.locations
    : [];
  const phases = Array.isArray(p.designModule?.phases)
    ? p.designModule.phases
    : [];
  const rawStatus = p.statusModule?.overallStatus;

  return {
    id: p.identificationModule?.nctId ?? null,
    title: p.identificationModule?.briefTitle ?? "Untitled study",
    status: formatStatus(rawStatus),
    statusColor: STATUS_COLORS[rawStatus] ?? "gray",
    updated: p.statusModule?.lastUpdatePostDateStruct?.date ?? null,
    phases: phases.map(formatPhase),
    summary: p.descriptionModule?.briefSummary ?? null,
    places: locations
      .slice(0, 3)
      .map((l) => [l?.city, l?.country].filter(Boolean).join(", "))
      .filter(Boolean)
      .join(" \u2009| \u2009"),
  };
}