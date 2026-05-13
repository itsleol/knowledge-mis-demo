export function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export default function DashboardWidget({ title, description, children, className = "" }) {
  return (
    <section className={`dashboard-widget ${className}`.trim()}>
      <div className="widget-header">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}
