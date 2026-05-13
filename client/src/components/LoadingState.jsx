export default function LoadingState({ text = "正在加载..." }) {
  return <div className="loading-state">{text}</div>;
}
