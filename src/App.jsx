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

  useEffect(() => {
    let ignore = false; // stops an old request from overwriting a newer one

    async function loadStudies() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          "query.cond": query,
          pageSize: "20",
        });
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
  }, [query]);

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
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading studies…</p>}
      {error && <p role="alert">Couldn't load studies: {error}</p>}
      {!loading && !error && studies.length === 0 && <p>No studies found.</p>}

      {studies.map((s, i) => (
        <StudyCard
          key={s.protocolSection?.identificationModule?.nctId ?? i}
          study={s}
        />
      ))}
    </main>
  );
}