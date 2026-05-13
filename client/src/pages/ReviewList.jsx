import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, FileCheck2 } from "lucide-react";
import { api } from "../services/api";
import Empty from "../components/Empty";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";

export default function ReviewList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api("/reviews/pending").then((data) => setItems(data.items));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="审核管理"
        title="待审核知识"
        description="部门知识管理员只处理本部门提交内容，审核通过后知识进入统一知识库。"
        actions={<span className="badge-token badge-token-warning"><Clock3 size={14} /> {items.length} 项待处理</span>}
      />
      <section className="dashboard-widget">
        <div className="widget-header">
          <h2>审核任务队列</h2>
          <p>优先查看提交人、部门与更新时间，进入详情后完成通过或驳回。</p>
        </div>
        <DataTable>
        <table>
          <thead><tr><th>知识编号</th><th>标题</th><th>状态</th><th>提交人</th><th>部门</th><th>更新时间</th><th>操作</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.knowledgeCode}</td>
                <td><Link to={`/reviews/${item._id}`}>{item.title}</Link></td>
                <td><StatusBadge status={item.status} /></td>
                <td>{item.creator?.name}</td>
                <td>{item.department?.name}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
                <td className="table-action-cell">
                  <Button as={Link} variant="ghost" to={`/reviews/${item._id}`}><FileCheck2 size={15} />处理</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </DataTable>
        {!items.length && <Empty text="当前没有待审核知识" />}
      </section>
    </>
  );
}
