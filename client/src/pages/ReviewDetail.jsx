import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Clock3, FileText, XCircle } from "lucide-react";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FormField from "../components/FormField";
import AttachmentList from "../components/AttachmentList";
import MetadataPanel, { MetadataItem } from "../components/MetadataPanel";

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
      <PageHeader
        eyebrow="审核详情"
        title={item.title}
        description={`${item.knowledgeCode} · ${item.creator?.name || "提交人"} · ${item.department?.name || "未分配部门"}`}
        actions={<StatusBadge status={item.status} />}
      />
      <div className="detail-layout review-detail-layout">
        <article className="panel readable">
          <div className="review-task-banner">
            <FileText size={18} />
            <div>
              <strong>待审核知识正文</strong>
              <span>请核对内容完整性、分类准确性与附件可用性，再填写审核意见。</span>
            </div>
          </div>
          <h2>摘要</h2>
          <p>{item.summary || "暂无摘要"}</p>
          <h2>正文</h2>
          <p>{item.content}</p>
          <h2>附件</h2>
          <AttachmentList files={item.attachments || []} />
          <h2>标签</h2>
          <div className="tags">{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </article>
        <MetadataPanel title="审核元信息">
          <MetadataItem label="状态"><StatusBadge status={item.status} /></MetadataItem>
          <MetadataItem label="提交人">{item.creator?.name || "-"}</MetadataItem>
          <MetadataItem label="部门">{item.department?.name || "-"}</MetadataItem>
          <MetadataItem label="分类">{item.category?.name || "-"}</MetadataItem>
          <MetadataItem label="更新时间"><span className="meta-line"><Clock3 size={14} /> {new Date(item.updatedAt).toLocaleString()}</span></MetadataItem>
          <MetadataItem label="版本">V{String(item.versionNo || 1).padStart(2, "0")}</MetadataItem>
        </MetadataPanel>
      </div>
      <div className="panel review-action-panel">
        <h2>审核处理</h2>
        <FormField label="审核意见" helper="通过时作为发布记录保存；驳回时员工将在我的知识中看到此意见。">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </FormField>
        <div className="button-row">
          <Button variant="primary" onClick={() => review("approve")}><CheckCircle size={16} />审核通过并发布</Button>
          <Button variant="danger" onClick={() => review("reject")}><XCircle size={16} />驳回修改</Button>
        </div>
      </div>
    </>
  );
}
