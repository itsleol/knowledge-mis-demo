import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkX, Heart } from "lucide-react";
import { api } from "../services/api";
import Empty from "../components/Empty";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";

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
      <PageHeader
        eyebrow="知识复用"
        title="我的收藏"
        actions={<span className="badge-token badge-token-success"><Heart size={14} /> {items.length} 条收藏</span>}
      />
      <section className="dashboard-widget">
        <div className="widget-header">
          <h2>收藏知识</h2>
        </div>
        {items.map((fav) => fav.knowledgeId && (
          <div className="favorite-row" key={fav._id}>
            <Link to={`/knowledge/${fav.knowledgeId._id}`}>
              <strong>{fav.knowledgeId.title}</strong>
              <span>{fav.knowledgeId.category?.name} · 收藏于 {new Date(fav.createdAt).toLocaleDateString()}</span>
            </Link>
            <Button variant="ghost" onClick={() => remove(fav.knowledgeId._id)}><BookmarkX size={15} />取消收藏</Button>
          </div>
        ))}
        {!items.length && <Empty />}
      </section>
    </>
  );
}
