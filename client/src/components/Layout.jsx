import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  Users
} from "lucide-react";
import { roleLabels, setToken } from "../services/api";
import Button from "./Button";
import { RoleChip } from "./StatusChip";

const menuGroups = [
  {
    title: "知识工作台",
    items: [
      { to: "/", label: "首页", icon: Home, roles: ["employee", "knowledge_manager", "system_admin", "decision_maker"] },
      { to: "/knowledge", label: "知识库", icon: BookOpen, roles: ["employee", "knowledge_manager", "system_admin", "decision_maker"] },
      { to: "/knowledge/new", label: "新建知识", icon: PenSquare, roles: ["employee", "knowledge_manager", "system_admin"] },
      { to: "/mine", label: "我的知识", icon: Archive, roles: ["employee", "knowledge_manager", "system_admin"] },
      { to: "/favorites", label: "我的收藏", icon: Heart, roles: ["employee", "knowledge_manager", "system_admin", "decision_maker"] }
    ]
  },
  {
    title: "审核管理",
    items: [
      { to: "/reviews", label: "待审核", icon: ClipboardCheck, roles: ["knowledge_manager"] },
      { to: "/categories", label: "分类与标签", icon: FolderTree, roles: ["knowledge_manager"] }
    ]
  },
  {
    title: "统计分析",
    items: [
      { to: "/analytics", label: "统计分析", icon: BarChart3, roles: ["knowledge_manager", "decision_maker"] }
    ]
  },
  {
    title: "系统管理",
    items: [
      { to: "/users", label: "用户管理", icon: Users, roles: ["system_admin"] },
      { to: "/settings", label: "系统设置", icon: Settings, roles: ["system_admin"] }
    ]
  }
];

export default function Layout({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const visibleGroups = menuGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => item.roles.includes(user.role)) }))
    .filter((group) => group.items.length);

  function logout() {
    setToken(null);
    onLogout();
    navigate("/login");
  }

  function isActive(item) {
    const path = location.pathname;
    if (item.to === "/") return path === "/";
    if (item.to === "/knowledge") return path === "/knowledge" || /^\/knowledge\/[a-f0-9]{24}$/i.test(path);
    return path === item.to || path.startsWith(`${item.to}/`);
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.jpg" alt="知识管理系统 Logo" className="brand-logo" />
          <div>
            <strong>知识管理 MIS</strong>
            <span>组织知识工作台</span>
          </div>
        </div>
        <nav className="nav">
          {visibleGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <span className="nav-group-title">{group.title}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} className={isActive(item) ? "active" : ""}>
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">
            <strong>组织知识管理工作台</strong>
            <span>采集、审核、检索、复用与统计分析</span>
          </div>
          <div className="topbar-user">
            <div>
              <strong>{user.name}</strong>
              <span>{user.department?.name || "未分配部门"}</span>
            </div>
            <RoleChip role={user.role} />
            <Button variant="ghost" onClick={logout} title="退出登录">
              <LogOut size={16} />
              退出
            </Button>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
