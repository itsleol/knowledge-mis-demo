import { statusLabels } from "../services/api";

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{statusLabels[status] || status}</span>;
}
