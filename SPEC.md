# 个人博客后端管理系统 - 项目规格说明书

> 项目名称: blog-admin-react-node
> 创建时间: 2026-03-20
> 版本: v1.0.0

---

## 一、项目概述

一个功能完整的个人博客后端管理系统，包含 **Node.js + Express REST API** 后端和 **React + Ant Design** 前端管理界面。

## 二、技术栈

### 后端
| 技术 | 用途 |
|------|------|
| Node.js 18+ | 运行时 |
| Express 4.x | Web 框架 |
| MongoDB + Mongoose 7 | 数据库 |
| JWT | 认证 |
| Multer | 文件上传 |
| bcryptjs | 密码加密 |
| Winston | 日志 |

### 前端
| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| Vite | 构建工具 |
| Ant Design 5 | UI 组件库 |
| Zustand | 状态管理 |
| Axios | HTTP 客户端 |
| React Router v6 | 路由 |

## 三、项目结构

```
blog-admin-react-node/
├── backend/                   # Express API 服务
│   ├── src/
│   │   ├── config/            # 配置（db.js, index.js）
│   │   ├── controllers/       # 控制器（auth, post, category, tag, comment, media, stats）
│   │   ├── middlewares/       # 中间件（auth.js, upload.js）
│   │   ├── models/            # 数据模型（User, Post, Category, Tag, Comment, Media）
│   │   ├── routes/            # 路由定义
│   │   └── utils/             # 工具函数（logger, response, paginate, slug）
│   ├── uploads/               # 文件上传目录
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/                   # React 管理后台
│   ├── src/
│   │   ├── api/               # Axios 实例
│   │   ├── components/       # 通用组件（MainLayout）
│   │   ├── pages/            # 页面（Login, Dashboard, PostList, PostEdit, Category, Tag, Comment, Media）
│   │   ├── store/            # Zustand 状态
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── README.md
└── SPEC.md
```

## 四、API 接口

### 认证 (/api/auth)
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /login | 登录，返回 JWT |
| POST | /register | 注册（仅第一个用户） |
| GET | /me | 当前用户信息 |
| POST | /logout | 登出 |

### 文章 (/api/posts)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 列表（分页/筛选/搜索） |
| GET | /:id | 详情 |
| POST | / | 创建 |
| PUT | /:id | 更新 |
| DELETE | /:id | 软删除 |
| PUT | /:id/sticky | 置顶/取消置顶 |

### 分类 (/api/categories)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 树形列表 |
| POST | / | 创建 |
| PUT | /:id | 更新 |
| DELETE | /:id | 删除 |

### 标签 (/api/tags)
- GET / POST / PUT / DELETE CRUD 完整

### 评论 (/api/comments)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 列表 |
| PUT | /:id/review | 审核（通过/拒绝） |
| POST | /:id/reply | 回复 |
| DELETE | /:id | 删除 |

### 媒体 (/api/media)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 列表 |
| POST | /upload | 上传 |
| DELETE | /:id | 删除 |

### 统计 (/api/stats)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /dashboard | 仪表盘数据 |

## 五、数据库模型

### User
- username (唯一, 3-20字符)
- password (加密)
- nickname, avatar, role

### Post
- title, slug (唯一), content (Markdown)
- excerpt, coverImage
- category (ref), tags (ref[])
- status (draft/published), isSticky
- viewCount, deletedAt (软删除)

### Category
- name, slug, parentId, order, description

### Tag
- name, slug

### Comment
- postId, author, email, content
- status (pending/approved/rejected)
- reply, replyAt

### Media
- filename, originalName, url
- size, mimeType, uploaderId

## 六、前端页面

1. **登录页** - JWT 认证
2. **仪表盘** - 统计卡片、今日数据
3. **文章列表** - 表格、搜索、筛选
4. **文章编辑** - Markdown 编辑
5. **分类管理** - 树形结构
6. **标签管理** - 标签列表
7. **评论管理** - 审核、回复
8. **媒体管理** - 图片网格上传

## 七、安全特性

- 密码 bcrypt 加密 (salt 10)
- JWT 认证 (24h) + Refresh Token (7d)
- CORS 白名单
- 输入验证
- 软删除保护
- 管理员权限控制

## 八、快速启动

```bash
# 方式1: Docker
docker-compose up -d

# 方式2: 本地
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```
