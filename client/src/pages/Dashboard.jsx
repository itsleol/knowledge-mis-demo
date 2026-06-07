import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, BookOpen, ClipboardCheck, Search } from "lucide-react";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import DashboardWidget, { StatCard } from "../components/DashboardWidget";

export default function Dashboard({ user }) {
  const [overview, setOverview] = useState(null);
  const [hot, setHot] = useState([]);
  const canAnalytics = ["knowledge_manager", "decision_maker"].includes(user.role);

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
      <PageHeader
        eyebrow="知识工作台"
        title="组织知识概览"
      />
      <div className="quick-grid">
        <Link className="quick-card" to="/knowledge"><BookOpen /><div><strong>知识库</strong><span>检索已发布知识</span></div></Link>
        {user.role !== "decision_maker" && <Link className="quick-card" to="/knowledge/new"><Search /><div><strong>采集新知识</strong><span>提交经验与文档</span></div></Link>}
        {user.role === "knowledge_manager" && <Link className="quick-card" to="/reviews"><ClipboardCheck /><div><strong>审核管理</strong><span>处理待发布知识</span></div></Link>}
        {canAnalytics && <Link className="quick-card" to="/analytics"><BarChart3 /><div><strong>统计分析</strong><span>查看知识利用数据</span></div></Link>}
      </div>
      {overview && (
        <div className="metric-grid">
          <StatCard label="知识总量" value={overview.total} detail="全状态知识" />
          <StatCard label="已发布知识" value={overview.approved} detail="可检索可复用" />
          <StatCard label="待审核知识" value={overview.pending} detail="等待审核发布" />
          <StatCard label="归档知识" value={overview.archived} detail="历史知识保留" />
          <StatCard label="累计复用" value={overview.totalViews} detail="浏览访问次数" />
          <StatCard label="用户评分" value={overview.averageRating} detail="反馈均值" />
        </div>
      )}
      <DashboardWidget title="热门知识推荐">
        <div className="table-list">
          {hot.map((item) => (
            <Link key={item._id} to={`/knowledge/${item._id}`} className="row-link">
              <span>{item.title}</span>
              <small>浏览 {item.viewCount} · 评分 {item.averageRating || 0}</small>
            </Link>
          ))}
        </div>
      </DashboardWidget>
    </>
  );
}
