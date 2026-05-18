import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2, X } from "lucide-react";
import { api, roleLabels } from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { Badge, RoleChip } from "../components/StatusChip";

const emptyUserForm = {
  name: "",
  email: "",
  password: "password123",
  department: "",
  role: "employee",
  status: "active"
};

export default function UserManage() {
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyUserForm);
  const [editingId, setEditingId] = useState("");
  const [query, setQuery] = useState("");
  const [deptForm, setDeptForm] = useState({ name: "", code: "", parentId: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const data = await api("/users");
    setItems(data.items);
    setDepartments(data.departments);
    if (!form.department && data.departments[0]) setForm((old) => ({ ...old, department: data.departments[0]._id }));
  }

  useEffect(() => { load(); }, []);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => [
      item.name,
      item.email,
      item.department?.name,
      item.department?.code,
      roleLabels[item.role],
      item.status === "active" ? "启用" : "禁用"
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword)));
  }, [items, query]);

  function resetUserForm() {
    setEditingId("");
    setForm({
      ...emptyUserForm,
      department: departments[0]?._id || ""
    });
  }

  function editUser(item) {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      email: item.email || "",
      password: "",
      department: item.department?._id || departments[0]?._id || "",
      role: item.role || "employee",
      status: item.status || "active"
    });
    setError("");
    setMessage("");
  }

  async function saveUser(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = { ...form };
      if (editingId && !payload.password) delete payload.password;
      if (editingId) {
        await api(`/users/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("账号信息已更新。");
      } else {
        await api("/users", { method: "POST", body: JSON.stringify(payload) });
        setMessage("账号已新增。");
      }
      resetUserForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    setError("");
    await api(`/users/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    await load();
  }

  async function removeUser(id, name) {
    if (!window.confirm(`确定删除账号「${name}」吗？`)) return;
    setError("");
    setMessage("");
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      if (editingId === id) resetUserForm();
      setMessage("账号已删除。");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function createDepartment(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api("/departments", { method: "POST", body: JSON.stringify(deptForm) });
      setDeptForm({ name: "", code: "", parentId: "" });
      setMessage("部门已新增。");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeDepartment(id) {
    if (!window.confirm("确定删除该部门吗？")) return;
    try {
      await api(`/departments/${id}`, { method: "DELETE" });
      setMessage("部门已删除。");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader eyebrow="系统管理" title="用户管理" description="维护账号、角色、状态和部门信息。" />
      {error && <div className="alert">{error}</div>}
      {message && <div className="success">{message}</div>}

      <div className="management-stack">
        <section className="dashboard-widget">
          <div className="widget-header compact-header">
            <h2>账号与角色</h2>
          </div>
          <form className="user-manage-form" onSubmit={saveUser}>
            <FormField label="姓名"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="邮箱账号"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
            <FormField label={editingId ? "新密码" : "初始密码"} helper={editingId ? "留空表示不修改密码。" : ""}>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </FormField>
            <FormField label="部门">
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
            </FormField>
            <FormField label="角色">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </FormField>
            <FormField label="状态">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">启用</option>
                <option value="disabled">禁用</option>
              </select>
            </FormField>
            <div className="form-actions">
              <Button variant="primary">{editingId ? <Edit3 size={16} /> : <Plus size={16} />}{editingId ? "保存修改" : "新增用户"}</Button>
              {editingId && <Button type="button" variant="ghost" onClick={resetUserForm}><X size={16} />取消编辑</Button>}
            </div>
          </form>

          <div className="table-toolbar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input placeholder="搜索姓名、邮箱、部门或角色" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <span className="muted">共 {filteredItems.length} 个账号</span>
          </div>

          <DataTable className="user-table-scroll">
            <table className="user-table">
              <thead><tr><th>姓名</th><th>邮箱</th><th>部门</th><th>角色</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className={editingId === item._id ? "selected-row" : ""} onClick={() => editUser(item)}>
                    <td className="user-name-cell">{item.name}</td>
                    <td>{item.email}</td>
                    <td className="user-department-cell">{item.department?.name || "-"}</td>
                    <td><RoleChip role={item.role} /></td>
                    <td><Badge tone={item.status === "active" ? "success" : "neutral"}>{item.status === "active" ? "启用" : "禁用"}</Badge></td>
                    <td className="table-action-cell" onClick={(event) => event.stopPropagation()}>
                      <Button variant="link" onClick={() => editUser(item)}>编辑</Button>
                      <Button variant="link" onClick={() => updateStatus(item._id, item.status === "active" ? "disabled" : "active")}>{item.status === "active" ? "禁用" : "启用"}</Button>
                      <Button variant="link" className="danger-text" onClick={() => removeUser(item._id, item.name)}><Trash2 size={14} />删除</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        </section>

        <section className="dashboard-widget">
          <div className="widget-header compact-header">
            <h2>部门维护</h2>
          </div>
          <form className="department-form" onSubmit={createDepartment}>
            <FormField label="部门名称"><input placeholder="例如：研发部" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} /></FormField>
            <FormField label="部门代码"><input placeholder="例如 D05" value={deptForm.code} onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })} /></FormField>
            <FormField label="上级部门">
              <select value={deptForm.parentId} onChange={(e) => setDeptForm({ ...deptForm, parentId: e.target.value })}>
                <option value="">无上级部门</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.code} {d.name}</option>)}
              </select>
            </FormField>
            <Button variant="primary"><Plus size={16} />新增部门</Button>
          </form>
          <DataTable>
            <table>
              <thead><tr><th>代码</th><th>名称</th><th>操作</th></tr></thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id}>
                    <td><span className="code-chip">{dept.code}</span></td><td>{dept.name}</td><td className="table-action-cell"><Button variant="link" className="danger-text" onClick={() => removeDepartment(dept._id)}>删除</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        </section>
      </div>
    </>
  );
}
