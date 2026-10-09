import { useEffect, useState } from "react";
import StudyCard from "./StudyCard";
import "./App.css";

const API_URL =
  "https://clinicaltrials.gov/api/v2/studies?query.cond=diabetes&pageSize=20";

export default function App() {
  const [studies, setStudies] = useState([]);

  useEffect(() => {
    async function loadStudies() {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudies(data.studies);
    }
    loadStudies();
  }, []);

  return (
    <main>
      <h1>Clinical Trial Finder</h1>
      {studies.map((s) => (
        <StudyCard key={s.protocolSection.identificationModule.nctId} study={s} />
      ))}
    </main>
  );
}