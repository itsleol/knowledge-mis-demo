import { useState } from "react";
import { BookOpenCheck, ClipboardCheck, LogIn, Search, ShieldCheck } from "lucide-react";
import { api, setToken } from "../services/api";
import Button from "../components/Button";
import FormField from "../components/FormField";

const accounts = [
  "employee@example.com",
  "manager@example.com",
  "admin@example.com",
  "decision@example.com"
];

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("employee@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <section className="login-intro">
        <span className="page-eyebrow">Management Information Systems Demo</span>
        <h1>知识管理 MIS</h1>
        <p>面向组织知识采集、审核、检索与复用的管理信息系统。用一个可运行原型展示从逻辑设计进入系统实施的完整闭环。</p>
        <div className="login-feature-list">
          <div className="login-feature"><BookOpenCheck size={20} /><strong>知识沉淀</strong><span>草稿、附件、分类、标签和版本记录</span></div>
          <div className="login-feature"><ClipboardCheck size={20} /><strong>部门审核</strong><span>manager 处理本部门待审核知识</span></div>
          <div className="login-feature"><Search size={20} /><strong>检索复用</strong><span>关键词、分类、标签和热门推荐</span></div>
          <div className="login-feature"><ShieldCheck size={20} /><strong>角色权限</strong><span>员工、经理、管理员、决策者分工明确</span></div>
        </div>
      </section>
      <form className="login-card" onSubmit={submit}>
        <h1>登录工作台</h1>
        <p>选择一个演示账号进入对应角色视图。</p>
        <FormField label="演示账号">
          <select value={email} onChange={(e) => setEmail(e.target.value)}>
            {accounts.map((item) => <option key={item}>{item}</option>)}
          </select>
        </FormField>
        <FormField label="密码">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>
        <div className="demo-accounts">
          <strong>Demo accounts</strong>
          <span>employee / manager / admin / decision，默认密码均为 password123。</span>
        </div>
        {error && <div className="alert">{error}</div>}
        <Button variant="primary">
          <LogIn size={18} />
          登录系统
        </Button>
      </form>
    </div>
  );
}
