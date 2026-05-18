import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send, Upload } from "lucide-react";
import { api, accessLabels } from "../services/api";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FormField from "../components/FormField";
import AttachmentList from "../components/AttachmentList";

const empty = { title: "", summary: "", content: "", category: "", tags: "", accessLevel: "department", attachments: [] };

export default function KnowledgeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api("/categories").then((data) => setCategories(data.items));
    if (id) {
      api(`/knowledge/${id}`).then((data) => {
        const item = data.item;
        setForm({
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category?._id || "",
          tags: item.tags?.join(", ") || "",
          accessLevel: item.accessLevel,
          attachments: item.attachments || []
        });
      });
    }
  }, [id]);

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function uploadFiles(files) {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    setUploading(true);
    setErrors([]);
    const body = new FormData();
    selected.forEach((file) => body.append("files", file));
    try {
      const data = await api("/uploads", { method: "POST", body });
      setForm((old) => ({ ...old, attachments: [...old.attachments, ...data.items] }));
      setMessage(`已上传 ${data.items.length} 个附件。`);
    } catch (err) {
      setErrors([err.message || "附件上传失败"]);
    } finally {
      setUploading(false);
    }
  }

  function removeAttachment(index) {
    setForm((old) => ({ ...old, attachments: old.attachments.filter((item, itemIndex) => itemIndex !== index) }));
  }

  function validate() {
    const next = [];
    if (!form.title.trim()) next.push("title 必填");
    if (!form.content.trim()) next.push("content 必填");
    if (!form.category) next.push("category 必填");
    if (!form.accessLevel) next.push("accessLevel 必填");
    setErrors(next);
    return next.length === 0;
  }

  async function save(status = "draft") {
    setErrors([]);
    setMessage("");
    if (status === "pending" && !validate()) return;
    try {
      const payload = { ...form, status };
      const data = id
        ? await api(`/knowledge/${id}`, { method: "PUT", body: JSON.stringify(payload) })
        : await api("/knowledge", { method: "POST", body: JSON.stringify(payload) });
      if (status === "pending" && id) await api(`/knowledge/${id}/submit`, { method: "POST" });
      if (status === "pending" && !id) await api(`/knowledge/${data.item._id}/submit`, { method: "POST" });
      navigate(status === "pending" ? "/mine" : `/knowledge/${data.item._id}`);
    } catch (err) {
      setErrors(err.payload?.errors || [err.message]);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="知识编辑"
        title={id ? "编辑知识" : "新建知识"}
        description="像撰写内部文档一样沉淀知识；草稿可暂存，提交审核时执行必填校验。"
      />
      <div className="panel form-panel knowledge-editor">
        {errors.length > 0 && <div className="alert">{errors.join("；")}</div>}
        {message && <div className="success">{message}</div>}
        <FormField label="标题">
          <input className="title-input" placeholder="输入知识标题" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </FormField>
        <FormField label="摘要" helper="用于知识列表和搜索结果中快速理解内容。">
          <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} />
        </FormField>
        <FormField label="正文">
          <textarea className="content-textarea" rows="12" value={form.content} onChange={(e) => update("content", e.target.value)} />
        </FormField>
        <div className="form-grid">
          <FormField label="分类">
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="">请选择分类</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.code} {c.name}</option>)}
            </select>
          </FormField>
          <FormField label="访问级别">
            <select value={form.accessLevel} onChange={(e) => update("accessLevel", e.target.value)}>
              {Object.entries(accessLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="标签" helper="使用英文逗号分隔，例如：流程, 模板, 项目复盘">
          <input value={form.tags} onChange={(e) => update("tags", e.target.value)} />
        </FormField>
        <label className="file-label">
          <Upload size={18} />
          {uploading ? "附件上传中..." : "上传附件"}
          <span>支持 PDF、PPT、Word、图片、文本，单个文件最大 8MB</span>
          <input
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.txt"
            disabled={uploading}
            onChange={(e) => {
              uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <AttachmentList files={form.attachments} editable onRemove={removeAttachment} />
        <div className="button-row">
          <Button variant="ghost" onClick={() => save("draft")}><Save size={16} />保存草稿</Button>
          <Button variant="primary" onClick={() => save("pending")}><Send size={16} />提交审核</Button>
        </div>
      </div>
    </>
  );
}
