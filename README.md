# 个人博客后端管理系统

全栈个人博客管理后端系统，基于 Node.js + Express + MongoDB + React。

## 功能特性

- 🔐 JWT 认证（登录/注册/登出）
- 📝 文章管理（CRUD、草稿/发布、置顶、Markdown）
- 🗂️ 分类管理（树形结构）
- 🏷️ 标签管理
- 💬 评论审核
- 🖼️ 媒体上传
- 📊 统计仪表盘

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Node.js + Express + MongoDB |
| 前端 | React 18 + Vite + Ant Design |
| 认证 | JWT |
| 部署 | Docker Compose |

## 快速开始

### 本地开发

```bash
# 启动 MongoDB
docker-compose up -d mongodb

# 安装后端依赖
cd backend
npm install
npm run dev

# 安装前端依赖
cd ../frontend
npm install
npm run dev
```

### Docker 部署

```bash
docker-compose up -d
```

## API 文档

详见 [SPEC.md](./SPEC.md)

## 许可证

MIT
