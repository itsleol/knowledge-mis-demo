import { useEffect, useState } from "react";
import { api, statusLabels } from "../services/api";

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

  if (!overview) return <div className="loading">正在生成统计报表...</div>;

  return (
    <>
      <div className="page-title"><div><h1>统计分析 Dashboard</h1><p>面向管理层的知识资产利用情况输出。</p></div></div>
      <div className="metric-grid">
        <div className="metric"><span>知识总数</span><strong>{overview.total}</strong></div>
        <div className="metric"><span>已发布</span><strong>{overview.approved}</strong></div>
        <div className="metric"><span>待审核</span><strong>{overview.pending}</strong></div>
        <div className="metric"><span>归档</span><strong>{overview.archived}</strong></div>
        <div className="metric"><span>总浏览量</span><strong>{overview.totalViews}</strong></div>
        <div className="metric"><span>平均评分</span><strong>{overview.averageRating}</strong></div>
      </div>
      <div className="split">
        <div className="panel">
          <h2>部门知识贡献排行</h2>
          {departments.map((row) => <Bar key={row._id} label={row.departmentName} value={row.total} max={Math.max(...departments.map((d) => d.total), 1)} detail={`已发布 ${row.approved} · 浏览 ${row.views}`} />)}
        </div>
        <div className="panel">
          <h2>状态分布</h2>
          {overview.statusDistribution.map((row) => <Bar key={row.status} label={statusLabels[row.status]} value={row.count} max={overview.total} />)}
        </div>
      </div>
      <div className="split">
        <div className="panel">
          <h2>热门知识 Top 5</h2>
          {hot.map((item) => <div className="rank-row" key={item._id}><strong>{item.title}</strong><span>浏览 {item.viewCount} · 评分 {item.averageRating}</span></div>)}
        </div>
        <div className="panel">
          <h2>高频搜索词 Top 10</h2>
          {keywords.map((item) => <div className="rank-row" key={item.keyword}><strong>{item.keyword}</strong><span>{item.count} 次</span></div>)}
        </div>
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
