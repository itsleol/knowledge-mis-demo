import { Inbox } from "lucide-react";

export default function EmptyState({ title = "暂无数据", description, action }) {
  return (
    <div className="empty-state-card">
      <Inbox size={22} />
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
