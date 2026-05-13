import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, roleLabels } from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { Badge, RoleChip } from "../components/StatusChip";

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
      <PageHeader
        eyebrow="系统管理"
        title="用户管理"
        description="系统管理员维护账号、角色和部门，支撑 RBAC 权限控制演示。"
      />
      {error && <div className="alert">{error}</div>}
      <div className="split">
        <section className="dashboard-widget">
          <div className="widget-header">
            <h2>账号与角色</h2>
            <p>新增演示账号后，可立即通过角色导航验证不同权限边界。</p>
          </div>
          <form className="inline-form compact" onSubmit={create}>
            <input placeholder="姓名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="邮箱" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <Button variant="primary"><Plus size={16} />新增用户</Button>
          </form>
          <DataTable>
          <table>
            <thead><tr><th>姓名</th><th>邮箱</th><th>部门</th><th>角色</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td><td>{item.email}</td><td>{item.department?.name}</td><td><RoleChip role={item.role} /></td><td><Badge tone={item.status === "active" ? "success" : "neutral"}>{item.status === "active" ? "启用" : "禁用"}</Badge></td>
                  <td className="table-action-cell"><Button variant="link" onClick={() => updateStatus(item._id, item.status === "active" ? "disabled" : "active")}>{item.status === "active" ? "禁用" : "启用"}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </DataTable>
        </section>
        <section className="dashboard-widget">
          <div className="widget-header">
            <h2>部门维护</h2>
            <p>部门用于限定知识管理员的审核范围，也是统计分析的组织维度。</p>
          </div>
          <form className="form-panel" onSubmit={createDepartment}>
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
