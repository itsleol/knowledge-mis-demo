import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [comment, setComment] = useState("内容完整，符合发布要求。");
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/knowledge/${id}`).then((data) => setItem(data.item)).catch((err) => setError(err.message));
  }, [id]);

  async function review(result) {
    try {
      await api(`/reviews/${id}/${result}`, { method: "POST", body: JSON.stringify({ comment }) });
      navigate("/reviews");
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div className="alert">{error}</div>;
  if (!item) return <div className="loading">正在加载审核详情...</div>;

  return (
    <>
      <div className="page-title"><div><h1>审核详情</h1><p>{item.knowledgeCode} · {item.creator?.name}</p></div><StatusBadge status={item.status} /></div>
      <div className="panel readable">
        <h2>{item.title}</h2>
        <p>{item.summary}</p>
        <p>{item.content}</p>
        <div className="tags">{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="panel">
        <label>审核意见</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="button-row">
          <button className="primary icon-text" onClick={() => review("approve")}><CheckCircle size={16} />审核通过并发布</button>
          <button className="danger icon-text" onClick={() => review("reject")}><XCircle size={16} />驳回修改</button>
        </div>
      </div>
    </>
  );
}
