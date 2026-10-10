import { useEffect, useState } from "react";
import StudyCard from "./StudyCard";
import "./App.css";

const BASE_URL = "https://clinicaltrials.gov/api/v2/studies";

export default function App() {
  const [input, setInput] = useState("diabetes");
  const [query, setQuery] = useState("diabetes");
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [showSummaries, setShowSummaries] = useState(false);

  useEffect(() => {
    let ignore = false; // stops an old request from overwriting a newer one

    async function loadStudies() {
      const params = new URLSearchParams({
        "query.cond": query,
        pageSize: "20",
      });
      if (status) params.set("filter.overallStatus", status);

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}?${params}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (!ignore) setStudies(data.studies ?? []);
      } catch (err) {
        if (!ignore) {
          setError(err.message);
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

  function handleSearch(e) {
    e.preventDefault();
    setQuery(input.trim());
  }

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
    </main>
  );
}