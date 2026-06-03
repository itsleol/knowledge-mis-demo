import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Save, Trash2 } from "lucide-react";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FormField from "../components/FormField";
import DataTable from "../components/DataTable";

const initial = { name: "", code: "", parentId: "", description: "" };

export default function CategoryManage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);

  async function load() {
    const [data, tagData] = await Promise.all([
      api("/categories"),
      api("/tags/summary")
    ]);
    setItems(data.items);
    setTags(tagData.items || []);
  }

  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, parentId: form.parentId || null };
      if (editing) await api(`/categories/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/categories", { method: "POST", body: JSON.stringify(payload) });
      setForm(initial);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    try {
      await api(`/categories/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(item) {
    setEditing(item._id);
    setForm({ name: item.name, code: item.code, parentId: item.parentId?._id || "", description: item.description || "" });
  }

  const roots = items.filter((item) => !item.parentId);
  const childrenOf = (id) => items.filter((item) => item.parentId?._id === id);

  return (
    <>
      <PageHeader
        eyebrow="知识组织"
        title="分类与标签管理"
      />
      <div className="split">
        <form className="dashboard-widget form-panel" onSubmit={save}>
          <div className="widget-header">
            <h2>{editing ? "编辑分类" : "新增分类"}</h2>
          </div>
          {error && <div className="alert">{error}</div>}
          <FormField label="分类名称"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="分类代码"><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></FormField>
          <FormField label="上级分类">
            <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
              <option value="">无</option>
              {items.filter((item) => item._id !== editing).map((item) => <option key={item._id} value={item._id}>{item.code} {item.name}</option>)}
            </select>
          </FormField>
          <FormField label="说明"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <Button variant="primary">{editing ? <Save size={16} /> : <Plus size={16} />}{editing ? "保存分类" : "新增分类"}</Button>
        </form>
        <div className="stack">
          <section className="dashboard-widget">
            <div className="widget-header">
              <h2>分类体系</h2>
            </div>
            <div className="category-tree">
              {roots.map((root) => (
                <div className="category-node" key={root._id}>
                  <strong><span className="code-chip">{root.code}</span>{root.name}</strong>
                  {childrenOf(root._id).map((child) => (
                    <span className="category-child" key={child._id}><span className="code-chip">{child.code}</span>{child.name}</span>
                  ))}
                </div>
              ))}
            </div>
            <DataTable className="category-table">
            <table>
              <thead><tr><th>代码</th><th>名称</th><th>上级</th><th>操作</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td><span className="code-chip">{item.code}</span></td><td>{item.name}</td><td>{item.parentId?.name || "-"}</td>
                    <td className="table-action-cell">
                      <div className="actions">
                        <Button variant="link" onClick={() => edit(item)}>编辑</Button>
                        <Button variant="link" className="danger-text" onClick={() => remove(item._id)}><Trash2 size={14} />删除</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </DataTable>
          </section>

          <section className="dashboard-widget">
            <div className="widget-header">
              <h2>标签汇总</h2>
            </div>
            <div className="tag-summary-grid">
              {tags.map((item) => (
                <Link className="tag-summary-card" key={item.tag} to={`/knowledge?tag=${encodeURIComponent(item.tag)}`}>
                  <span className="tag-chip">{item.tag}</span>
                  <strong>{item.count}</strong>
                  <small>{item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString("zh-CN") : "-"}</small>
                </Link>
              ))}
            </div>
            {!tags.length && <p className="muted-text">暂无标签数据。</p>}
          </section>
        </div>
      </div>
    </>
  );
}
