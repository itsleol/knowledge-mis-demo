import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, roleLabels } from "../services/api";

export default function UserManage() {
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "password123", department: "", role: "employee", status: "active" });
  const [deptForm, setDeptForm] = useState({ name: "", code: "", parentId: "" });
  const [error, setError] = useState("");

  async function load() {
    const data = await api("/users");
    setItems(data.items);
    setDepartments(data.departments);
    if (!form.department && data.departments[0]) setForm((old) => ({ ...old, department: data.departments[0]._id }));
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/users", { method: "POST", body: JSON.stringify(form) });
      setForm({ ...form, name: "", email: "" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    await api(`/users/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    await load();
  }

  async function createDepartment(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/departments", { method: "POST", body: JSON.stringify(deptForm) });
      setDeptForm({ name: "", code: "", parentId: "" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeDepartment(id) {
    try {
      await api(`/departments/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-title"><div><h1>用户管理</h1><p>系统管理员维护账号、角色和部门。</p></div></div>
      {error && <div className="alert">{error}</div>}
      <div className="split">
        <div className="panel">
          <h2>账号与角色</h2>
          <form className="inline-form compact" onSubmit={create}>
            <input placeholder="姓名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="邮箱" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <button className="primary icon-text"><Plus size={16} />新增用户</button>
          </form>
          <table>
            <thead><tr><th>姓名</th><th>邮箱</th><th>部门</th><th>角色</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td><td>{item.email}</td><td>{item.department?.name}</td><td>{roleLabels[item.role]}</td><td>{item.status}</td>
                  <td><button className="link-button" onClick={() => updateStatus(item._id, item.status === "active" ? "disabled" : "active")}>{item.status === "active" ? "禁用" : "启用"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h2>部门维护</h2>
          <form className="form-panel" onSubmit={createDepartment}>
            <input placeholder="部门名称" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} />
            <input placeholder="部门代码，例如 D05" value={deptForm.code} onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })} />
            <select value={deptForm.parentId} onChange={(e) => setDeptForm({ ...deptForm, parentId: e.target.value })}>
              <option value="">无上级部门</option>
              {departments.map((d) => <option key={d._id} value={d._id}>{d.code} {d.name}</option>)}
            </select>
            <button className="primary icon-text"><Plus size={16} />新增部门</button>
          </form>
          <table>
            <thead><tr><th>代码</th><th>名称</th><th>操作</th></tr></thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.code}</td><td>{dept.name}</td><td><button className="link-button danger-text" onClick={() => removeDepartment(dept._id)}>删除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
