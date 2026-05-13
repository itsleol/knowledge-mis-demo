import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Archive, Edit, Eye, Heart, MessageSquare } from "lucide-react";
import { api, roleLabels } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import MetadataPanel, { MetadataItem } from "../components/MetadataPanel";
import AttachmentList from "../components/AttachmentList";

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
  const canManage = user.role === "knowledge_manager" && item.department?._id === user.department?._id;
  const canEdit = canManage || (item.creator?._id === user.id && ["draft", "rejected"].includes(item.status));

  return (
    <>
      <PageHeader
        eyebrow={item.knowledgeCode}
        title={item.title}
        description={`${item.category?.name || "未分类"} · ${item.department?.name || "未分配部门"}`}
        actions={
          <div className="button-row">
            <Button variant="ghost" onClick={favorite}><Heart size={16} />{data.isFavorite ? "取消收藏" : "收藏"}</Button>
            {canEdit && <Button as={Link} variant="ghost" to={`/knowledge/${id}/edit`}><Edit size={16} />编辑</Button>}
            {canManage && item.status !== "archived" && <Button variant="danger" onClick={archive}><Archive size={16} />归档</Button>}
          </div>
        }
      />
      <div className="detail-layout">
        <article className="panel readable">
          {data.latestReview && ["rejected", "approved"].includes(item.status) && (
            <div className={`review-summary review-summary-${data.latestReview.result}`}>
              <strong>{data.latestReview.result === "rejected" ? "退回意见" : "审核意见"}</strong>
              <p>{data.latestReview.comment || "无具体意见"}</p>
              <small>{data.latestReview.reviewerId?.name || "审核人"} · {new Date(data.latestReview.reviewTime).toLocaleString()}</small>
            </div>
          )}
          <h2>摘要</h2>
          <p>{item.summary || "暂无摘要"}</p>
          <h2>正文</h2>
          <p>{item.content}</p>
          <h2>附件</h2>
          <AttachmentList files={item.attachments || []} />
        </article>
        <MetadataPanel title="知识元信息">
          <MetadataItem label="状态"><StatusBadge status={item.status} /></MetadataItem>
          <MetadataItem label="创建人">{item.creator?.name || "-"}</MetadataItem>
          <MetadataItem label="部门">{item.department?.name || "-"}</MetadataItem>
          <MetadataItem label="分类">{item.category?.name || "-"}</MetadataItem>
          <MetadataItem label="版本">V{String(item.versionNo || 1).padStart(2, "0")}</MetadataItem>
          <MetadataItem label="浏览量"><span className="meta-line"><Eye size={14} /> {item.viewCount || 0}</span></MetadataItem>
          <MetadataItem label="平均评分">{item.averageRating || 0}</MetadataItem>
          <MetadataItem label="标签"><div className="tags">{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></MetadataItem>
        </MetadataPanel>
      </div>
      <div className="split">
        <div className="panel">
          <h2>评分与评论</h2>
          <form className="feedback-form" onSubmit={feedback}>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} 分</option>)}
            </select>
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="评论内容" />
            <Button variant="primary"><MessageSquare size={16} />提交</Button>
          </form>
          {data.feedbacks.map((fb) => <div className="comment" key={fb._id}><strong>{fb.userId?.name}</strong><span>{fb.rating} 分</span><p>{fb.comment}</p></div>)}
        </div>
        <div className="panel">
          <h2>审核记录</h2>
          {data.reviews?.length ? data.reviews.map((review) => (
            <div className={`audit-row audit-row-${review.result}`} key={review._id}>
              <strong>{review.result === "approved" ? "审核通过" : "驳回修改"}</strong>
              <span>{review.comment || "无具体意见"}</span>
              <small>{review.reviewerId?.name} · {roleLabels[review.reviewerId?.role] || "审核人"} · {new Date(review.reviewTime).toLocaleString()}</small>
            </div>
          )) : <div className="empty">暂无审核记录</div>}
        </div>
      </div>
      <div className="panel">
        <h2>相似知识推荐</h2>
        <div className="table-list">
          {data.similar.map((item) => <Link className="row-link" key={item._id} to={`/knowledge/${item._id}`}>{item.title}<small>浏览 {item.viewCount}</small></Link>)}
        </div>
      </div>
    </>
  );
}
