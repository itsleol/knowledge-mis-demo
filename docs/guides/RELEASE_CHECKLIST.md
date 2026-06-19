# Release Checklist

展示前按顺序检查以下项目。

## 环境启动

- [ ] 已执行 `git pull` 获取最新代码。
- [ ] 已执行 `docker compose up --build`。
- [ ] MongoDB、server、client 容器均处于运行状态。
- [ ] 后端健康检查可访问：<http://localhost:5001/api/health>。
- [ ] 前端可访问：<http://localhost:5173>。

## 数据与账号

- [ ] seed data 已成功生成。
- [ ] `employee@example.com / password123` 可登录。
- [ ] `manager@example.com / password123` 可登录。
- [ ] `admin@example.com / password123` 可登录。
- [ ] `decision@example.com / password123` 可登录。
- [ ] Dashboard 有统计数据，不是空白。
- [ ] 待审核列表中至少有一条 seed 待审核知识，或已准备一条新提交知识。

## 附件与上传

- [ ] `server/uploads/` 或 Docker uploads volume 存在。
- [ ] seed 附件占位文件可打开。
- [ ] 新建知识时可以上传本地测试文件。
- [ ] 知识详情页和审核详情页都能显示附件。

## 自动化检查

- [ ] 后端 API 测试通过：

  ```bash
  docker compose exec -T server npm test
  ```

- [ ] 前端构建通过：

  ```bash
  docker compose exec -T client npm run build
  ```

- [ ] 前端 smoke 检查通过：

  ```bash
  docker compose exec -T client npm run test:smoke
  ```

## 浏览器与演示准备

- [ ] 推荐浏览器窗口宽度不小于 1280px。
- [ ] 浏览器缩放保持 100%。
- [ ] 演示前清理或避开标题以 `[E2E]`、`[测试]` 开头的测试知识。
- [ ] 准备一个小于 8MB 的 PDF、Word、图片或文本文件用于上传演示。
- [ ] 按 [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) 走一遍完整流程。

## 可接受的未实现扩展

- [ ] 批量导入仅作为未来扩展说明。
- [ ] 多人实时协作仅作为未来扩展说明。
- [ ] 真实备份脚本仅作为未来扩展说明，当前系统设置页为实施模拟。
- [ ] 完整 Playwright 浏览器 E2E 留作后续增强，当前使用前端 smoke 检查。
