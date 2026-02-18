import { Activity, Gauge, Target, Undo2 } from 'lucide-react';

const cards = [
  { key: 'grossWpm', label: 'Gross WPM', icon: Gauge },
  { key: 'accuracy', label: 'Accuracy', icon: Target, suffix: '%' },
  { key: 'netWpm', label: 'Net WPM', icon: Gauge },
  { key: 'backspaceCount', label: 'Backspaces', icon: Undo2 }
];

export default function MetricsBar({ metrics }) {
  return (
    <div className="metrics-grid">
      {cards.map(({ key, label, icon: Icon, suffix = '' }) => (

        <div key={key} className="metric-card">
          
          <div className="metric-head">
            <Icon size={15} />
            <span>{label}</span>
          </div>
          <strong>
            {metrics[key]}
            {suffix}
          </strong>
        </div>
      ))}
    </div>
  );
}
