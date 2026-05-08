import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Empty from "../components/Empty";

export default function ReviewList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api("/reviews/pending").then((data) => setItems(data.items));
  }, []);

  return (
    <>
      <div className="page-title"><div><h1>待审核知识</h1><p>部门知识管理员审核本部门提交内容。</p></div></div>
      <div className="panel">
        <table>
          <thead><tr><th>知识编号</th><th>标题</th><th>提交人</th><th>部门</th><th>更新时间</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.knowledgeCode}</td>
                <td><Link to={`/reviews/${item._id}`}>{item.title}</Link></td>
                <td>{item.creator?.name}</td>
                <td>{item.department?.name}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <Empty text="当前没有待审核知识" />}
      </div>
    </>
  );
}
