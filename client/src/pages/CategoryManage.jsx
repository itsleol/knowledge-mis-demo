import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { api } from "../services/api";

const initial = { name: "", code: "", parentId: "", description: "" };

export default function CategoryManage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const data = await api("/categories");
    setItems(data.items);
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

  return (
    <>
      <div className="page-title"><div><h1>分类与标签管理</h1><p>维护树状分类，标签由知识条目直接沉淀。</p></div></div>
      <div className="split">
        <form className="panel form-panel" onSubmit={save}>
          <h2>{editing ? "编辑分类" : "新增分类"}</h2>
          {error && <div className="alert">{error}</div>}
          <label>分类名称</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>分类代码</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <label>上级分类</label>
          <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
            <option value="">无</option>
            {items.filter((item) => item._id !== editing).map((item) => <option key={item._id} value={item._id}>{item.code} {item.name}</option>)}
          </select>
          <label>说明</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="primary icon-text">{editing ? <Save size={16} /> : <Plus size={16} />}{editing ? "保存" : "新增"}</button>
        </form>
        <div className="panel">
          <table>
            <thead><tr><th>代码</th><th>名称</th><th>上级</th><th>操作</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.code}</td><td>{item.name}</td><td>{item.parentId?.name || "-"}</td>
                  <td className="actions"><button className="link-button" onClick={() => edit(item)}>编辑</button><button className="link-button danger-text" onClick={() => remove(item._id)}><Trash2 size={14} />删除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
