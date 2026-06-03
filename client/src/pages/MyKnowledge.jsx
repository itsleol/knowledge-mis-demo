import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareWarning, Send } from "lucide-react";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Empty from "../components/Empty";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Button from "../components/Button";

export default function MyKnowledge() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    const data = await api("/knowledge/mine");
    setItems(data.items);
  }

  useEffect(() => { load().catch((err) => setError(err.message)); }, []);

  async function submit(id) {
    try {
      await api(`/knowledge/${id}/submit`, { method: "POST" });
      await load();
    } catch (err) {
      setError(err.payload?.errors?.join("；") || err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="个人工作台"
        title="我的知识"
        actions={<Button as={Link} to="/knowledge/new" variant="primary">新建知识</Button>}
      />
      {error && <div className="alert">{error}</div>}
      <section className="dashboard-widget">
        <div className="widget-header">
          <h2>知识列表</h2>
        </div>
        <DataTable>
        <table>
          <thead><tr><th>标题</th><th>状态</th><th>分类</th><th>更新时间</th><th>审核意见</th><th>操作</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td><Link to={`/knowledge/${item._id}`}>{item.title}</Link></td>
                <td><StatusBadge status={item.status} /></td>
                <td>{item.category?.name}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
                <td>
                  {item.latestReview ? (
                    <div className={`review-note review-note-${item.latestReview.result}`}>
                      <MessageSquareWarning size={14} />
                      <span>{item.latestReview.comment || "无具体意见"}</span>
                    </div>
                  ) : (
                    <span className="muted">-</span>
                  )}
                </td>
                <td>
                  <div className="actions">
                    {["draft", "rejected"].includes(item.status) && <Link to={`/knowledge/${item._id}/edit`}>编辑</Link>}
                    {["draft", "rejected"].includes(item.status) && <Button variant="link" onClick={() => submit(item._id)}><Send size={14} />提交</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </DataTable>
        {!items.length && <Empty />}
      </section>
    </>
  );
}
