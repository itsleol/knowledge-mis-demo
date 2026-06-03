import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../services/api";
import Empty from "../components/Empty";
import PageHeader from "../components/PageHeader";
import KnowledgeCard from "../components/KnowledgeCard";
import Button from "../components/Button";
import SearchFilterBar from "../components/SearchFilterBar";

export default function KnowledgeList() {
  const [searchParams] = useSearchParams();
  const initialTag = searchParams.get("tag") || "";
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", category: "", tag: initialTag, status: "", sort: "updated" });
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
      <PageHeader
        eyebrow="知识库"
        title="知识库列表"
      />
      <SearchFilterBar onSubmit={submitSearch}>
        <input placeholder="关键词" value={filters.keyword} onChange={(e) => update("keyword", e.target.value)} />
        <select value={filters.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">全部分类</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.code} {c.name}</option>)}
        </select>
        <input placeholder="标签" value={filters.tag} onChange={(e) => update("tag", e.target.value)} />
        <select value={filters.status} onChange={(e) => update("status", e.target.value)}>
          <option value="">已发布知识</option>
          <option value="approved">已发布</option>
          <option value="pending">待审核</option>
          <option value="rejected">已退回</option>
          <option value="archived">已归档</option>
        </select>
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="updated">按更新时间</option>
          <option value="views">按浏览量</option>
          <option value="rating">按评分</option>
        </select>
        <Button variant="primary" type="submit">
          <Search size={16} /> 检索
        </Button>
      </SearchFilterBar>
      {error && <div className="alert">{error}</div>}
      <div className="knowledge-grid">
        {items.map((item) => <KnowledgeCard item={item} key={item._id} />)}
      </div>
      {!items.length && <Empty text="没有匹配的知识条目" />}
    </>
  );
}
