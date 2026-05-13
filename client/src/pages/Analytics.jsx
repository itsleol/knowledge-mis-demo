import { useEffect, useState } from "react";
import { api, statusLabels } from "../services/api";
import PageHeader from "../components/PageHeader";
import DashboardWidget, { StatCard } from "../components/DashboardWidget";
import LoadingState from "../components/LoadingState";

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [hot, setHot] = useState([]);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    Promise.all([
      api("/analytics/overview"),
      api("/analytics/departments"),
      api("/analytics/hot-knowledge"),
      api("/analytics/search-keywords")
    ]).then(([o, d, h, k]) => {
      setOverview(o);
      setDepartments(d.items);
      setHot(h.items);
      setKeywords(k.items);
    });
  }, []);

  if (!overview) return <LoadingState text="正在生成统计报表..." />;

  return (
    <>
      <PageHeader
        eyebrow="决策分析"
        title="统计分析 Dashboard"
        description="面向管理层输出知识资产规模、利用率、部门贡献和检索热点。"
      />
      <div className="metric-grid">
        <StatCard label="知识总数" value={overview.total} detail="全状态知识资产" />
        <StatCard label="已发布" value={overview.approved} detail="可检索可复用" />
        <StatCard label="待审核" value={overview.pending} detail="经理待处理" />
        <StatCard label="归档" value={overview.archived} detail="历史沉淀" />
        <StatCard label="总浏览量" value={overview.totalViews} detail="知识利用情况" />
        <StatCard label="平均评分" value={overview.averageRating} detail="用户反馈均值" />
      </div>
      <div className="split">
        <DashboardWidget title="部门知识贡献排行" description="按部门汇总知识数、已发布数与浏览量。">
          {departments.map((row) => <Bar key={row._id} label={row.departmentName} value={row.total} max={Math.max(...departments.map((d) => d.total), 1)} detail={`已发布 ${row.approved} · 浏览 ${row.views}`} />)}
        </DashboardWidget>
        <DashboardWidget title="状态分布" description="展示草稿、审核、发布、退回和归档的流程分布。">
          {overview.statusDistribution.map((row) => <Bar key={row.status} label={statusLabels[row.status]} value={row.count} max={overview.total} />)}
        </DashboardWidget>
      </div>
      <div className="split">
        <DashboardWidget title="热门知识 Top 5" description="按浏览量与评分呈现知识复用热点。">
          {hot.map((item) => <div className="rank-row" key={item._id}><strong>{item.title}</strong><span>浏览 {item.viewCount} · 评分 {item.averageRating}</span></div>)}
        </DashboardWidget>
        <DashboardWidget title="高频搜索词 Top 10" description="从 searchLogs 中汇总用户检索需求。">
          {keywords.map((item) => <div className="rank-row" key={item.keyword}><strong>{item.keyword}</strong><span>{item.count} 次</span></div>)}
        </DashboardWidget>
      </div>
    </>
  );
}

function Bar({ label, value, max, detail }) {
  return (
    <div className="bar-row">
      <div className="bar-label"><span>{label}</span><strong>{value}</strong></div>
      <div className="bar-track"><div style={{ width: `${Math.max((value / max) * 100, 6)}%` }} /></div>
      {detail && <small>{detail}</small>}
    </div>
  );
}
