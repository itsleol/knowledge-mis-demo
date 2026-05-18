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
    cache: options.cache || "no-store",
    headers: { ...headers, ...(options.headers || {}) }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(toChineseMessage(data.message || "请求失败。"));
    error.payload = data;
    throw error;
  }
  return data;
}

function toChineseMessage(message) {
  const map = {
    "Request failed": "请求失败。",
    "Email and password are required.": "请输入账号和密码。",
    "Invalid email or password.": "账号或密码错误。",
    "Missing authentication token.": "登录状态已失效，请重新登录。",
    "User is not active or no longer exists.": "账号已被禁用或不存在。",
    "Invalid or expired authentication token.": "登录状态已过期，请重新登录。",
    "You do not have permission to perform this action.": "当前账号没有执行此操作的权限。",
    "Validation failed.": "输入内容不符合要求。",
    "Duplicate value exists.": "已存在相同数据，请检查后重试。",
    "User not found.": "用户不存在。",
    "Knowledge item not found.": "知识条目不存在。",
    "Knowledge submission is incomplete.": "知识提交信息不完整。",
    "Department not found.": "部门不存在。",
    "Cannot delete a department that still has users.": "该部门下仍有用户，不能删除。",
    "Cannot delete a department that has child departments.": "该部门存在下级部门，不能删除。",
    "Category not found.": "分类不存在。",
    "Cannot delete a category that has child categories.": "该分类存在下级分类，不能删除。",
    "Rating must be between 1 and 5.": "评分必须在 1 到 5 之间。",
    "Published knowledge item not found.": "已发布知识不存在。",
    "Unsupported attachment type.": "附件类型不支持。",
    "Favorite removed.": "已取消收藏。"
  };
  return map[message] || message || "请求失败。";
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
