import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({ icon: Icon, label, value, tone }) {
  return (
    <section className={`metric-card ${tone}`}>
      <div className="metric-icon">
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <ArrowUpRight className="metric-trend" size={18} />
    </section>
  );
}

