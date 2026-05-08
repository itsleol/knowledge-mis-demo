const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export async function api(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.payload = data;
    throw error;
  }
  return data;
}

export const roleLabels = {
  employee: "普通员工",
  knowledge_manager: "部门知识管理员",
  system_admin: "系统管理员",
  decision_maker: "决策者"
};

export const statusLabels = {
  draft: "草稿",
  pending: "待审核",
  approved: "已发布",
  rejected: "已退回",
  archived: "已归档"
};

export const accessLabels = {
  public: "全员",
  department: "部门",
  role: "角色",
  private: "私有"
};
