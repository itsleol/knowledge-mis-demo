import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Empty from "../components/Empty";

export default function Favorites() {
  const [items, setItems] = useState([]);

  async function load() {
    const data = await api("/favorites/me");
    setItems(data.items);
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    await api(`/favorites/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <div className="page-title"><div><h1>我的收藏</h1><p>知识共享与复用入口。</p></div></div>
      <div className="panel">
        {items.map((fav) => fav.knowledgeId && (
          <div className="favorite-row" key={fav._id}>
            <Link to={`/knowledge/${fav.knowledgeId._id}`}>
              <strong>{fav.knowledgeId.title}</strong>
              <span>{fav.knowledgeId.category?.name} · 收藏于 {new Date(fav.createdAt).toLocaleDateString()}</span>
            </Link>
            <button className="ghost" onClick={() => remove(fav.knowledgeId._id)}>取消收藏</button>
          </div>
        ))}
        {!items.length && <Empty />}
      </div>
    </>
  );
}
