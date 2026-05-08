import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Archive,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FolderTree,
  Heart,
  Home,
  LogOut,
  PenSquare,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import { roleLabels, setToken } from "../services/api";

const menu = [
  { to: "/", label: "首页", icon: Home, roles: ["employee", "knowledge_manager", "system_admin", "decision_maker"] },
  { to: "/knowledge", label: "知识库", icon: BookOpen, roles: ["employee", "knowledge_manager", "system_admin", "decision_maker"] },
  { to: "/knowledge/new", label: "新建知识", icon: PenSquare, roles: ["employee", "knowledge_manager", "system_admin"] },
  { to: "/mine", label: "我的知识", icon: Archive, roles: ["employee", "knowledge_manager", "system_admin"] },
  { to: "/favorites", label: "我的收藏", icon: Heart, roles: ["employee", "knowledge_manager", "system_admin", "decision_maker"] },
  { to: "/reviews", label: "待审核", icon: ClipboardCheck, roles: ["knowledge_manager", "system_admin"] },
  { to: "/categories", label: "分类与标签", icon: FolderTree, roles: ["knowledge_manager", "system_admin"] },
  { to: "/users", label: "用户管理", icon: Users, roles: ["system_admin"] },
  { to: "/analytics", label: "统计分析", icon: BarChart3, roles: ["knowledge_manager", "system_admin", "decision_maker"] },
  { to: "/settings", label: "系统设置", icon: Settings, roles: ["system_admin"] }
];

export default function Layout({ user, onLogout }) {
  const navigate = useNavigate();
  const visible = menu.filter((item) => item.roles.includes(user.role));

  function logout() {
    setToken(null);
    onLogout();
    navigate("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={26} />
          <div>
            <strong>知识管理 MIS</strong>
            <span>System Demo</span>
          </div>
        </div>
        <nav className="nav">
          {visible.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <strong>{user.name}</strong>
            <span>{roleLabels[user.role]} · {user.department?.name || "未分配部门"}</span>
          </div>
          <button className="ghost icon-text" onClick={logout} title="退出登录">
            <LogOut size={16} />
            退出
          </button>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
