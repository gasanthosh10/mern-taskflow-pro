import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis } from 'recharts';

const colors = ['#2563eb', '#0f766e', '#f59e0b', '#111827'];

export function StatusChart({ data }) {
  return (
    <section className="panel chart-panel">
      <div className="section-heading compact">
        <div>
          <span>Progress</span>
          <h2>Status mix</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}

export function PriorityChart({ data }) {
  return (
    <section className="panel chart-panel">
      <div className="section-heading compact">
        <div>
          <span>Focus</span>
          <h2>Priority load</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

