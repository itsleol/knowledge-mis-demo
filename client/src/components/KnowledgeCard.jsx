import { Link } from "react-router-dom";
import { Eye, Star } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function KnowledgeCard({ item }) {
  return (
    <Link to={`/knowledge/${item._id}`} className="knowledge-card">
      <div className="knowledge-card-top">
        <span className="code-chip">{item.knowledgeCode}</span>
        <StatusBadge status={item.status} />
      </div>
      <strong>{item.title}</strong>
      <p>{item.summary || "暂无摘要"}</p>
      <div className="tags">{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="knowledge-card-meta">
        <span>{item.category?.name || "未分类"}</span>
        <span>{item.creator?.name || "未知作者"}</span>
        <span><Eye size={14} />{item.viewCount || 0}</span>
        <span><Star size={14} />{item.averageRating || 0}</span>
      </div>
    </Link>
  );
}
