import { useState } from "react";
import { LogIn } from "lucide-react";
import { api, setToken } from "../services/api";

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
      <form className="login-card" onSubmit={submit}>
        <h1>知识管理 MIS Demo</h1>
        <p>组织知识采集、审核、检索、共享与统计分析原型</p>
        <label>邮箱</label>
        <select value={email} onChange={(e) => setEmail(e.target.value)}>
          {accounts.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label>密码</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="alert">{error}</div>}
        <button className="primary icon-text">
          <LogIn size={18} />
          登录系统
        </button>
      </form>
    </div>
  );
}
