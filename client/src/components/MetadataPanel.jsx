export default function MetadataPanel({ title = "元信息", children }) {
  return (
    <aside className="metadata-panel">
      <h2>{title}</h2>
      <div className="metadata-list">{children}</div>
    </aside>
  );
}

export function MetadataItem({ label, children }) {
  return (
    <div className="metadata-item">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}
