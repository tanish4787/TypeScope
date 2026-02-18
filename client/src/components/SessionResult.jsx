import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SessionResult({ report }) {
  if (!report) return null;

  return (
    <motion.section
      className="report"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h3>
        <Sparkles size={16} /> AI Performance Insights
      </h3>
      <p>{report.aiFeedback.summary}</p>
      <div className="report-columns">
        <div>
          <h4>Strengths</h4>
          <ul>{report.aiFeedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h4>Improvements</h4>
          <ul>{report.aiFeedback.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h4>Drills</h4>
          <ul>{report.aiFeedback.drills.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </motion.section>
  );
}
