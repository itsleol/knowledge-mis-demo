import { useState } from "react";
import { DatabaseBackup, ShieldCheck, Wrench } from "lucide-react";

export default function SystemSettings() {
  const [logs, setLogs] = useState(["系统设置页用于演示维护、备份和日志审计流程。"]);

  function simulate(action) {
    setLogs((old) => [`${new Date().toLocaleString()} · ${action} 已完成模拟操作`, ...old]);
  }

  return (
    <>
      <div className="page-title"><div><h1>系统设置 / 备份模拟</h1><p>体现系统实施阶段的运行维护与安全保障方案。</p></div></div>
      <div className="quick-grid">
        <button className="quick-card" onClick={() => simulate("全量备份")}><DatabaseBackup />全量备份</button>
        <button className="quick-card" onClick={() => simulate("权限策略检查")}><ShieldCheck />权限检查</button>
        <button className="quick-card" onClick={() => simulate("系统维护窗口")}><Wrench />维护模拟</button>
      </div>
      <div className="panel">
        <h2>系统运行日志</h2>
        {logs.map((log, index) => <div className="log-line" key={`${log}-${index}`}>{log}</div>)}
      </div>
    </>
  );
}
