function parseTags(input) {
  if (Array.isArray(input)) {
    return input.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return String(input || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function requireKnowledgeFields(body) {
  const errors = [];
  if (!body.title || !String(body.title).trim()) errors.push("请输入知识标题");
  if (!body.content || !String(body.content).trim()) errors.push("请输入知识正文");
  if (!body.category) errors.push("请选择知识分类");
  if (!body.accessLevel) errors.push("请选择访问权限");
  return errors;
}

function canReadKnowledge(user, knowledge) {
  if (user.role === "system_admin" || user.role === "decision_maker") return true;
  if (String(knowledge.creator?._id || knowledge.creator) === String(user._id)) return true;
  if (user.role === "knowledge_manager") {
    return String(knowledge.department?._id || knowledge.department) === String(user.department?._id || user.department);
  }
  if (knowledge.status !== "approved") return false;
  if (knowledge.accessLevel === "public") return true;
  if (knowledge.accessLevel === "department") {
    return String(knowledge.department?._id || knowledge.department) === String(user.department?._id || user.department);
  }
  if (knowledge.accessLevel === "role") return true;
  return knowledge.accessLevel !== "private";
}

function canManageKnowledge(user, knowledge) {
  if (user.role !== "knowledge_manager") return false;
  return String(knowledge.department?._id || knowledge.department) === String(user.department?._id || user.department);
}

module.exports = {
  parseTags,
  requireKnowledgeFields,
  canReadKnowledge,
  canManageKnowledge
};
