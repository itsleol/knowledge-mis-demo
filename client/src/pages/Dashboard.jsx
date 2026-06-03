import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, BookOpen, ClipboardCheck, Search } from "lucide-react";
import { api, roleLabels } from "../services/api";
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
        eyebrow="工作台"
        title="首页"
      />
      <div className="quick-grid">
        <Link className="quick-card" to="/knowledge"><BookOpen /><div><strong>知识库检索</strong><span>搜索、筛选和阅读已发布知识</span></div></Link>
        {user.role !== "decision_maker" && <Link className="quick-card" to="/knowledge/new"><Search /><div><strong>提交知识</strong><span>创建草稿并提交部门审核</span></div></Link>}
        {user.role === "knowledge_manager" && <Link className="quick-card" to="/reviews"><ClipboardCheck /><div><strong>审核任务</strong><span>处理本部门待审核知识</span></div></Link>}
        {canAnalytics && <Link className="quick-card" to="/analytics"><BarChart3 /><div><strong>统计分析</strong><span>查看知识资产与利用情况</span></div></Link>}
      </div>
      {overview && (
        <div className="metric-grid">
          <StatCard label="知识总数" value={overview.total} detail="组织知识资产" />
          <StatCard label="已发布" value={overview.approved} detail="可被检索复用" />
          <StatCard label="待审核" value={overview.pending} detail="需要及时处理" />
          <StatCard label="总浏览量" value={overview.totalViews} detail="知识利用情况" />
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
