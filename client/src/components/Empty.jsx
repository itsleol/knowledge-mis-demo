import EmptyState from "./EmptyState";

export default function Empty({ text = "暂无数据" }) {
  return <EmptyState title={text} />;
}
