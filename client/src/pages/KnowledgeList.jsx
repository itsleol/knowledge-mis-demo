import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Empty from "../components/Empty";

export default function KnowledgeList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", category: "", tag: "", sort: "updated" });
  const [error, setError] = useState("");

  async function load(next = filters) {
    setError("");
    const params = new URLSearchParams(Object.entries(next).filter(([, value]) => value));
    try {
      const data = await api(`/knowledge?${params}`);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    api("/categories").then((data) => setCategories(data.items));
    load();
  }, []);

  function update(key, value) {
    setFilters((old) => ({ ...old, [key]: value }));
  }

  function submitSearch(event) {
    event.preventDefault();
    load();
  }

  return (
    <>
      <div className="page-title">
        <div><h1>知识库列表</h1><p>关键词、分类、标签、排序组合检索已发布知识。</p></div>
      </div>
      <form className="toolbar" onSubmit={submitSearch}>
        <input placeholder="关键词" value={filters.keyword} onChange={(e) => update("keyword", e.target.value)} />
        <select value={filters.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">全部分类</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.code} {c.name}</option>)}
        </select>
        <input placeholder="标签" value={filters.tag} onChange={(e) => update("tag", e.target.value)} />
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="updated">按更新时间</option>
          <option value="views">按浏览量</option>
          <option value="rating">按评分</option>
        </select>
        <button className="primary icon-text" type="submit">
          <Search size={16} /> 检索
        </button>
      </form>
      {error && <div className="alert">{error}</div>}
      <div className="knowledge-grid">
        {items.map((item) => (
          <Link to={`/knowledge/${item._id}`} className="knowledge-card" key={item._id}>
            <div className="card-head">
              <strong>{item.title}</strong>
              <StatusBadge status={item.status} />
            </div>
            <p>{item.summary}</p>
            <div className="tags">{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <small>{item.knowledgeCode} · {item.category?.name} · 浏览 {item.viewCount} · 评分 {item.averageRating || 0}</small>
          </Link>
        ))}
      </div>
      {!items.length && <Empty text="没有匹配的知识条目" />}
    </>
  );
}
