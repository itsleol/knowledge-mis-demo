import { useState } from "react";
import { DatabaseBackup, ShieldCheck, Wrench } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DashboardWidget, { StatCard } from "../components/DashboardWidget";

export default function SystemSettings() {
  const [logs, setLogs] = useState(["暂无维护记录"]);

  function simulate(action) {
    setLogs((old) => [`${new Date().toLocaleString()} · ${action} 已记录`, ...old.filter((item) => item !== "暂无维护记录")]);
  }

  return (
    <>
      <PageHeader
        eyebrow="系统管理"
        title="系统设置"
      />
      <div className="metric-grid">
        <StatCard label="服务状态" value="运行中" detail="Express / React / MongoDB" />
        <StatCard label="备份策略" value="每日" detail="保留关键业务数据" />
        <StatCard label="审计范围" value="登录与操作" detail="记录关键管理动作" />
      </div>
      <div className="quick-grid">
        <button className="quick-card" onClick={() => simulate("全量备份")}><DatabaseBackup /><strong>全量备份</strong><span>导出数据库与附件目录。</span></button>
        <button className="quick-card" onClick={() => simulate("权限策略检查")}><ShieldCheck /><strong>权限检查</strong><span>检查角色菜单与权限边界。</span></button>
        <button className="quick-card" onClick={() => simulate("系统维护窗口")}><Wrench /><strong>维护窗口</strong><span>记录维护时间和处理动作。</span></button>
      </div>
      <DashboardWidget title="系统运行日志">
        {logs.map((log, index) => <div className="log-line" key={`${log}-${index}`}>{log}</div>)}
      </DashboardWidget>
    </>
  );
}
