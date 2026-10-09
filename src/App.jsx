import { useEffect, useState } from "react";
import StudyCard from "./StudyCard";
import "./App.css";

const API_URL =
  "https://clinicaltrials.gov/api/v2/studies?query.cond=diabetes&pageSize=20";



export default function App() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStudies() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setStudies(data.studies ?? []);

      } catch (err) { 
        setError("We couldn't reach the clinical trials database. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadStudies();
  }, []);

  return (
    <main>
      <h1>Clinical Trial Finder</h1>
      {loading && <p>Loading studies…</p>}
      {error && <p role="alert">{error}</p>}
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