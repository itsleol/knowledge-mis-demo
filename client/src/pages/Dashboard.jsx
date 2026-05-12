import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, BookOpen, ClipboardCheck, Search } from "lucide-react";
import { api, roleLabels } from "../services/api";

export default function Dashboard({ user }) {
  const [overview, setOverview] = useState(null);
  const [hot, setHot] = useState([]);
  const canAnalytics = ["knowledge_manager", "system_admin", "decision_maker"].includes(user.role);

  useEffect(() => {
    if (!canAnalytics) {
      api("/knowledge?sort=views&limit=5").then((data) => setHot(data.items)).catch(() => {});
      return;
    }
    Promise.all([api("/analytics/overview"), api("/analytics/hot-knowledge")])
      .then(([o, h]) => {
        setOverview(o);
        setHot(h.items);
      })
      .catch(() => {});
  }, [canAnalytics]);

  return (
    <>
      <div className="page-title">
        <div>
          <h1>首页 Dashboard</h1>
          <p>{roleLabels[user.role]}工作台，展示知识生命周期的关键入口。</p>
        </div>
      </div>
      <div className="quick-grid">
        <Link className="quick-card" to="/knowledge"><BookOpen />知识库检索</Link>
        {user.role !== "decision_maker" && <Link className="quick-card" to="/knowledge/new"><Search />提交知识</Link>}
        {user.role === "knowledge_manager" && <Link className="quick-card" to="/reviews"><ClipboardCheck />审核任务</Link>}
        {canAnalytics && <Link className="quick-card" to="/analytics"><BarChart3 />统计分析</Link>}
      </div>
      {overview && (
        <div className="metric-grid">
          <div className="metric"><span>知识总数</span><strong>{overview.total}</strong></div>
          <div className="metric"><span>已发布</span><strong>{overview.approved}</strong></div>
          <div className="metric"><span>待审核</span><strong>{overview.pending}</strong></div>
          <div className="metric"><span>总浏览量</span><strong>{overview.totalViews}</strong></div>
        </div>
      )}
      <div className="panel">
        <h2>热门知识推荐</h2>
        <div className="table-list">
          {hot.map((item) => (
            <Link key={item._id} to={`/knowledge/${item._id}`} className="row-link">
              <span>{item.title}</span>
              <small>浏览 {item.viewCount} · 评分 {item.averageRating || 0}</small>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
