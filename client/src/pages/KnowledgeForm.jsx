import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send, Upload } from "lucide-react";
import { api, accessLabels } from "../services/api";

const empty = { title: "", summary: "", content: "", category: "", tags: "", accessLevel: "department", attachments: [] };

export default function KnowledgeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

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
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    const data = await api("/uploads", { method: "POST", body });
    update("attachments", [...form.attachments, ...data.items]);
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
      <div className="page-title"><div><h1>{id ? "编辑知识" : "新建知识"}</h1><p>草稿可暂存，提交审核时执行必填校验。</p></div></div>
      <div className="panel form-panel">
        {errors.length > 0 && <div className="alert">{errors.join("；")}</div>}
        {message && <div className="success">{message}</div>}
        <label>标题</label>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} />
        <label>摘要</label>
        <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} />
        <label>正文</label>
        <textarea rows="9" value={form.content} onChange={(e) => update("content", e.target.value)} />
        <div className="form-grid">
          <div>
            <label>分类</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="">请选择分类</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.code} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label>访问级别</label>
            <select value={form.accessLevel} onChange={(e) => update("accessLevel", e.target.value)}>
              {Object.entries(accessLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>
        <label>标签，使用英文逗号分隔</label>
        <input value={form.tags} onChange={(e) => update("tags", e.target.value)} />
        <label className="file-label"><Upload size={16} /> 上传附件 <input type="file" multiple onChange={(e) => uploadFiles(e.target.files)} /></label>
        <div className="attachments">{form.attachments.map((file) => <span key={file.fileName}>{file.originalName}</span>)}</div>
        <div className="button-row">
          <button className="ghost icon-text" onClick={() => save("draft")}><Save size={16} />保存草稿</button>
          <button className="primary icon-text" onClick={() => save("pending")}><Send size={16} />提交审核</button>
        </div>
      </div>
    </>
  );
}
