import { useEffect, useState } from "react";
import StudyCard from "./StudyCard";
import "./App.css";

const PAGE_SIZE = 20;
const BASE_URL = "https://clinicaltrials.gov/api/v2/studies";

export default function App() {
  const [input, setInput] = useState("diabetes");
  const [query, setQuery] = useState("diabetes");
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [showSummaries, setShowSummaries] = useState(false);

  function handleSearch(event) {
    event.preventDefault();
    setQuery(input.trim());
  }

  useEffect(() => {
    let ignore = false;

    async function loadStudies() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          "query.cond": query,
          pageSize: String(PAGE_SIZE),
        });
        if (status) params.set("filter.overallStatus", status);

        const res = await fetch(`${BASE_URL}?${params}`, {
          signal: AbortSignal.timeout(10000), // give up after 10 seconds
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (!ignore) setStudies(Array.isArray(data?.studies) ? data.studies : []);
      } catch (err) {
        if (!ignore) {
          setError(
            err.name === "TimeoutError"
              ? "The request took too long. Please try again."
              : err.message
          );
          setStudies([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

  loadStudies();
  return () => {
    ignore = true;
  };
}, [query, status]);

  return (
    <main>
      <h1>Clinical Trial Finder</h1>

      <form onSubmit={handleSearch} className="controls">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search a condition, e.g. asthma"
          aria-label="Condition"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Recruitment status"
        >
          <option value="">All statuses</option>
          <option value="RECRUITING">Recruiting</option>
          <option value="NOT_YET_RECRUITING">Not yet recruiting</option>
          <option value="ACTIVE_NOT_RECRUITING">Active, not recruiting</option>
          <option value="COMPLETED">Completed</option>
          </select>
        <button type="submit">Search</button>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showSummaries}
            onChange={(e) => setShowSummaries(e.target.checked)}
          />
          Show all summaries
        </label>
      </form>

      {loading && <p>Loading studies…</p>}
      {error && <p role="alert">Couldn't load studies: {error}</p>}
      {!loading && !error && studies.length === 0 && (
        <p>No studies matched your search. Try a different condition or recruitment status.</p>
      )}

      {studies.map((s, i) => (
        <StudyCard
          key={s.protocolSection?.identificationModule?.nctId ?? i}
          study={s}
          showSummary={showSummaries}
        />
      ))}

      {!loading && !error && studies.length === PAGE_SIZE && (
      <p className="limit-note">
        Showing the first {PAGE_SIZE} results only. More studies may match, so try
        a more specific search or a status filter to narrow things down.
      </p>
      )}
    </main>
  );
}