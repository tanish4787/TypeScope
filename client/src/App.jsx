import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, StopCircle } from "lucide-react";
import HeroHeader from "./components/HeroHeader";
import MetricsBar from "./components/MetricsBar";
import TextPanes from "./components/TextPanes";
import SessionResult from "./components/SessionResult";
import { useTypingSession } from "./hooks/useTypingSession";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const defaultParagraph = `Typing with precision is a skill that combines rhythm focus, and attention to punctuation. Practice daily, analyze your mistakes, and improve one micro-habit at a time.`;

export default function App() {
  const [sourceText, setSourceText] = useState(defaultParagraph);
  const [sessionId, setSessionId] = useState(null);
  const [report, setReport] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const session = useTypingSession(sourceText);

  const startSession = async () => {
    const response = await fetch(`${API_BASE}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText }),
    });

    if (!response.ok) {
      alert(
        "Unable to start session. Please check text length and server connectivity."
      );
      return;
    }

    const payload = await response.json();
    setSessionId(payload.sessionId);
    setReport(null);
    session.start();
  };

  const finishSession = async () => {
    if (!sessionId) return;
    session.finish();
    setIsSaving(true);

    const response = await fetch(`${API_BASE}/sessions/${sessionId}/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        typedText: session.typedText,
        durationMs: session.durationMs,
        backspaceCount: session.backspaceCount,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      alert("Could not finalize session report.");
      return;
    }

    const payload = await response.json();
    setReport(payload);
  };

  const resetSession = () => {
    session.reset();
    setSessionId(null);
    setReport(null);
  };

  return (
    <div className="app-shell">
      <HeroHeader />

      <motion.section
        className="setup panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Paste Your Paragraph</h2>
        <textarea
          className="source-input"
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          disabled={session.status === "active"}
        />
        <div className="meta">
          <span>{sourceText.length} characters</span>
          <span>
            {sourceText.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </motion.section>

      <MetricsBar metrics={session.metrics} />

      <TextPanes
        sourceText={sourceText}
        typedText={session.typedText}
        onInput={session.trackInput}
        disabled={session.status !== "active"}
      />

      <div className="actions">
        <button onClick={startSession} disabled={session.status === "active"}>
          <Play size={16} /> Start
        </button>
        <button
          onClick={finishSession}
          disabled={session.status !== "active" || isSaving}
        >
          <StopCircle size={16} /> {isSaving ? "Analyzing..." : "Finish"}
        </button>
        <button onClick={resetSession} className="ghost">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <SessionResult report={report} />
    </div>
  );
}
