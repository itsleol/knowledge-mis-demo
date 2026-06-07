import { useState } from "react";
import { DatabaseBackup, ShieldCheck, Wrench } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DashboardWidget, { StatCard } from "../components/DashboardWidget";

export default function SystemSettings() {
  const [logs, setLogs] = useState(["暂无维护记录"]);

  function recordAction(action) {
    setLogs((old) => [`${new Date().toLocaleString()} · ${action} 已记录`, ...old.filter((item) => item !== "暂无维护记录")]);
  }

  return (
    <>
      <PageHeader
        eyebrow="系统运维"
        title="运行与安全策略"
      />
      <div className="metric-grid">
        <StatCard label="运行状态" value="稳定" detail="前端 / API / 数据库" />
        <StatCard label="备份策略" value="每日" detail="知识库与附件目录" />
        <StatCard label="权限审计" value="启用" detail="角色与部门边界" />
      </div>
      <div className="quick-grid">
        <button className="quick-card" onClick={() => recordAction("知识库备份任务")}><DatabaseBackup /><strong>备份任务</strong><span>导出数据库与附件目录。</span></button>
        <button className="quick-card" onClick={() => recordAction("权限策略巡检")}><ShieldCheck /><strong>权限巡检</strong><span>核对角色菜单与权限边界。</span></button>
        <button className="quick-card" onClick={() => recordAction("维护窗口登记")}><Wrench /><strong>维护登记</strong><span>记录维护时间和处理动作。</span></button>
      </div>
      <DashboardWidget title="运维记录">
        {logs.map((log, index) => <div className="log-line" key={`${log}-${index}`}>{log}</div>)}
      </DashboardWidget>
    </>
  );
}
