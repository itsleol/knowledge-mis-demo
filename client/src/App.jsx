import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { api, getToken } from "./services/api";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KnowledgeList from "./pages/KnowledgeList";
import KnowledgeDetail from "./pages/KnowledgeDetail";
import KnowledgeForm from "./pages/KnowledgeForm";
import MyKnowledge from "./pages/MyKnowledge";
import ReviewList from "./pages/ReviewList";
import ReviewDetail from "./pages/ReviewDetail";
import CategoryManage from "./pages/CategoryManage";
import UserManage from "./pages/UserManage";
import Analytics from "./pages/Analytics";
import SystemSettings from "./pages/SystemSettings";
import Favorites from "./pages/Favorites";

function Gate({ user, roles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">正在连接知识管理系统...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />} />
        <Route
          element={
            <Gate user={user}>
              <Layout user={user} onLogout={() => setUser(null)} />
            </Gate>
          }
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="/knowledge" element={<KnowledgeList />} />
          <Route path="/knowledge/new" element={<KnowledgeForm />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetail user={user} />} />
          <Route path="/knowledge/:id/edit" element={<KnowledgeForm />} />
          <Route path="/mine" element={<MyKnowledge />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/reviews" element={<Gate user={user} roles={["knowledge_manager", "system_admin"]}><ReviewList /></Gate>} />
          <Route path="/reviews/:id" element={<Gate user={user} roles={["knowledge_manager", "system_admin"]}><ReviewDetail /></Gate>} />
          <Route path="/categories" element={<Gate user={user} roles={["knowledge_manager", "system_admin"]}><CategoryManage /></Gate>} />
          <Route path="/users" element={<Gate user={user} roles={["system_admin"]}><UserManage /></Gate>} />
          <Route path="/analytics" element={<Gate user={user} roles={["knowledge_manager", "system_admin", "decision_maker"]}><Analytics /></Gate>} />
          <Route path="/settings" element={<Gate user={user} roles={["system_admin"]}><SystemSettings /></Gate>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
