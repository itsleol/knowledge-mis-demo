import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Save, Send, Upload } from "lucide-react";
import { api, accessLabels } from "../services/api";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FormField from "../components/FormField";
import AttachmentList from "../components/AttachmentList";

const empty = { title: "", summary: "", content: "", category: "", tags: "", accessLevel: "department", attachments: [] };
const maxAttachments = 5;

const templates = [
  {
    name: "项目复盘模板",
    content: `## 背景

## 项目目标

## 关键过程

## 问题与原因

## 经验沉淀

## 后续行动`
  },
  {
    name: "培训资料模板",
    categoryName: "培训资料",
    content: `## 培训对象

## 学习目标

## 内容结构

## 操作步骤

## 注意事项

## 相关附件`
  },
  {
    name: "制度文档模板",
    content: `## 制度目的

## 适用范围

## 职责分工

## 流程要求

## 例外处理

## 附件说明`
  }
];

const tagRules = [
  { tag: "培训", keywords: ["培训", "学习", "课程", "教材", "入职", "新人"] },
  { tag: "制度", keywords: ["制度", "规范", "规定", "流程", "审批", "权限"] },
  { tag: "项目复盘", keywords: ["复盘", "项目", "上线", "问题", "经验", "改进"] },
  { tag: "接口", keywords: ["接口", "API", "参数", "响应", "错误码", "调用"] },
  { tag: "运维", keywords: ["故障", "应急", "告警", "运维", "恢复", "排查"] },
  { tag: "客户服务", keywords: ["客户", "投诉", "话术", "满意度", "服务", "售后"] },
  { tag: "数据分析", keywords: ["数据", "统计", "指标", "看板", "分析", "报表"] },
  { tag: "协作", keywords: ["会议", "纪要", "协作", "跨部门", "负责人", "跟进"] },
  { tag: "模板", keywords: ["模板", "样例", "清单", "格式", "字段"] },
  { tag: "知识管理", keywords: ["知识", "沉淀", "检索", "归档", "共享", "复用"] }
];

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueTags(tags) {
  return [...new Set(tags.map((item) => item.trim()).filter(Boolean))];
}

export default function KnowledgeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].name);

  const selectedCategory = categories.find((item) => item._id === form.category);
  const suggestedTags = useMemo(() => {
    const existing = new Set(splitTags(form.tags));
    const source = [
      form.title,
      form.summary,
      form.content,
      selectedCategory?.name,
      selectedTemplate
    ].join(" ");
    const matched = tagRules
      .filter((rule) => rule.keywords.some((keyword) => source.toLowerCase().includes(keyword.toLowerCase())))
      .map((rule) => rule.tag);
    if (selectedCategory?.name) matched.unshift(selectedCategory.name);
    return uniqueTags(matched).filter((tag) => !existing.has(tag)).slice(0, 6);
  }, [form.title, form.summary, form.content, form.tags, selectedCategory?.name, selectedTemplate]);

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

  function findTemplateCategory(templateName) {
    const template = templates.find((item) => item.name === templateName);
    if (!template?.categoryName) return "";
    return categories.find((item) => item.name === template.categoryName)?._id || "";
  }

  function handleTemplateChange(templateName) {
    setSelectedTemplate(templateName);
    const category = findTemplateCategory(templateName);
    if (category) {
      setForm((old) => ({ ...old, category }));
    }
  }

  function applyTags(tags) {
    const next = uniqueTags([...splitTags(form.tags), ...tags]);
    update("tags", next.join(", "));
  }

  async function uploadFiles(files) {
    const remaining = maxAttachments - form.attachments.length;
    if (remaining <= 0) {
      setErrors([`最多上传 ${maxAttachments} 个附件`]);
      return;
    }
    const selected = Array.from(files || []).slice(0, remaining);
    if (!selected.length) return;
    setUploading(true);
    setErrors([]);
    const body = new FormData();
    body.append("knowledgeTitle", form.title.trim() || "未命名知识");
    body.append("existingAttachmentCount", String(form.attachments.length));
    selected.forEach((file) => body.append("files", file));
    try {
      const data = await api("/uploads", { method: "POST", body });
      setForm((old) => ({ ...old, attachments: [...old.attachments, ...data.items] }));
      setMessage(files.length > selected.length
        ? `已上传 ${data.items.length} 个附件，最多保留 ${maxAttachments} 个附件。`
        : `已上传 ${data.items.length} 个附件。`);
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

  function insertTemplate() {
    const template = templates.find((item) => item.name === selectedTemplate);
    if (!template) return;
    const current = form.content.trim();
    if (current && !window.confirm("正文已有内容，是否将模板追加到当前正文末尾？")) return;
    update("content", current ? `${form.content.trim()}\n\n${template.content}` : template.content);
    setMessage(`已插入${template.name}。`);
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
        <div className="template-panel">
          <div className="template-copy">
            <FileText size={18} />
            <div>
              <strong>知识模板</strong>
            </div>
          </div>
          <div className="template-controls">
            <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)}>
              {templates.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
            <Button className="template-insert-button" variant="secondary" type="button" onClick={insertTemplate}>插入模板</Button>
          </div>
        </div>
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
        <FormField label="标签" helper="系统会根据标题、摘要、正文和分类推荐标签，也可以手动补充。">
          <input value={form.tags} onChange={(e) => update("tags", e.target.value)} />
          {suggestedTags.length > 0 && (
            <div className="tag-suggestion-panel">
              <div className="tag-suggestion-header">
                <span>推荐标签</span>
                <Button variant="link" type="button" onClick={() => applyTags(suggestedTags)}>应用推荐</Button>
              </div>
              <div className="tag-suggestion-list">
                {suggestedTags.map((tag) => (
                  <button key={tag} type="button" onClick={() => applyTags([tag])}>{tag}</button>
                ))}
              </div>
            </div>
          )}
        </FormField>
        <label className="file-label">
          <Upload size={18} />
          {uploading ? "附件上传中..." : "上传附件"}
          <span>支持 PDF、PPT、Word、图片、文本，单个文件最大 8MB，最多 {maxAttachments} 个附件</span>
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
