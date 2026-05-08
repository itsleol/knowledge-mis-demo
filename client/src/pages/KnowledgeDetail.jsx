import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Archive, Edit, Eye, Heart, MessageSquare } from "lucide-react";
import { API_ORIGIN, api } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function KnowledgeDetail({ user }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const next = await api(`/knowledge/${id}`);
    setData(next);
  }

  useEffect(() => {
    load().then(() => api(`/knowledge/${id}/view`, { method: "POST" })).catch((err) => setError(err.message));
  }, [id]);

  async function favorite() {
    await api(`/favorites/${id}`, { method: data.isFavorite ? "DELETE" : "POST" });
    await load();
  }

  async function archive() {
    await api(`/knowledge/${id}/archive`, { method: "POST", body: JSON.stringify({ comment: "Demo archive operation." }) });
    await load();
  }

  async function feedback(e) {
    e.preventDefault();
    await api(`/feedbacks/${id}`, { method: "POST", body: JSON.stringify({ rating, comment }) });
    setComment("");
    await load();
  }

  if (error) return <div className="alert">{error}</div>;
  if (!data) return <div className="loading">正在加载知识详情...</div>;

  const { item } = data;
  const canManage = user.role === "system_admin" || (user.role === "knowledge_manager" && item.department?._id === user.department?._id);
  const canEdit = canManage || (item.creator?._id === user.id && ["draft", "rejected"].includes(item.status));

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{item.title}</h1>
          <p>{item.knowledgeCode} · {item.category?.name} · {item.department?.name}</p>
        </div>
        <div className="button-row">
          <button className="ghost icon-text" onClick={favorite}><Heart size={16} />{data.isFavorite ? "取消收藏" : "收藏"}</button>
          {canEdit && <Link className="button ghost icon-text" to={`/knowledge/${id}/edit`}><Edit size={16} />编辑</Link>}
          {canManage && item.status !== "archived" && <button className="danger icon-text" onClick={archive}><Archive size={16} />归档</button>}
        </div>
      </div>
      <article className="panel readable">
        <div className="meta-line"><StatusBadge status={item.status} /> <span><Eye size={14} /> {item.viewCount}</span> <span>评分 {item.averageRating || 0}</span></div>
        <h2>摘要</h2>
        <p>{item.summary}</p>
        <h2>正文</h2>
        <p>{item.content}</p>
        <h2>附件</h2>
        <div className="attachments">
          {item.attachments?.map((file) => <a key={file.fileName} href={`${API_ORIGIN}${file.path}`} target="_blank">{file.originalName}</a>)}
        </div>
      </article>
      <div className="split">
        <div className="panel">
          <h2>评分与评论</h2>
          <form className="feedback-form" onSubmit={feedback}>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} 分</option>)}
            </select>
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="评论内容" />
            <button className="primary icon-text"><MessageSquare size={16} />提交</button>
          </form>
          {data.feedbacks.map((fb) => <div className="comment" key={fb._id}><strong>{fb.userId?.name}</strong><span>{fb.rating} 分</span><p>{fb.comment}</p></div>)}
        </div>
        <div className="panel">
          <h2>相似知识推荐</h2>
          {data.similar.map((item) => <Link className="row-link" key={item._id} to={`/knowledge/${item._id}`}>{item.title}<small>浏览 {item.viewCount}</small></Link>)}
        </div>
      </div>
    </>
  );
}
