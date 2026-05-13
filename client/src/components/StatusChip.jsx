import { roleLabels, statusLabels } from "../services/api";

export function StatusChip({ status }) {
  return <span className={`status-chip status-chip-${status}`}>{statusLabels[status] || status}</span>;
}

export function RoleChip({ role }) {
  return <span className={`role-chip role-chip-${role}`}>{roleLabels[role] || role}</span>;
}

export function Badge({ tone = "neutral", children }) {
  return <span className={`badge-token badge-token-${tone}`}>{children}</span>;
}
