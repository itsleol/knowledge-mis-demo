import { useState } from "react";
import { DatabaseBackup, ShieldCheck, Wrench } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DashboardWidget, { StatCard } from "../components/DashboardWidget";

export default function SystemSettings() {
  const [logs, setLogs] = useState(["系统设置页用于演示维护、备份和日志审计流程。"]);

  function simulate(action) {
    setLogs((old) => [`${new Date().toLocaleString()} · ${action} 已完成模拟操作`, ...old]);
  }

  return (
    <>
      <PageHeader
        eyebrow="系统实施"
        title="系统设置 / 备份模拟"
        description="体现系统开发实施阶段的运行维护、权限审计和备份恢复方案。"
      />
      <div className="metric-grid">
        <StatCard label="服务状态" value="运行中" detail="Express / React / MongoDB" />
        <StatCard label="备份策略" value="每日" detail="课程 Demo 模拟策略" />
        <StatCard label="审计范围" value="登录与操作" detail="系统管理演示" />
      </div>
      <div className="quick-grid">
        <button className="quick-card" onClick={() => simulate("全量备份")}><DatabaseBackup /><strong>全量备份</strong><span>模拟导出数据库与本地上传附件目录。</span></button>
        <button className="quick-card" onClick={() => simulate("权限策略检查")}><ShieldCheck /><strong>权限检查</strong><span>检查角色菜单、审核边界和系统管理入口。</span></button>
        <button className="quick-card" onClick={() => simulate("系统维护窗口")}><Wrench /><strong>维护模拟</strong><span>记录维护窗口，用于课程实施方案展示。</span></button>
      </div>
      <DashboardWidget title="系统运行日志" description="模拟维护动作会写入本页日志，展示系统运维输出设计。">
        {logs.map((log, index) => <div className="log-line" key={`${log}-${index}`}>{log}</div>)}
      </DashboardWidget>
    </>
  );
}
