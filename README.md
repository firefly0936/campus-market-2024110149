# 校园轻集市

## 1. 项目简介

"校园轻集市"是一个面向高校校园生活场景的 PC 端 Web App，主要支持二手交易、失物招领、拼单搭子、跑腿委托等校园常见业务。

学生可以在平台上浏览和搜索各类校园信息，收藏感兴趣的内容，发布自己的二手物品、失物招领、拼单或跑腿委托，并在个人中心管理自己的发布和收藏。

## 2. 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 | 前端框架（Composition API + Options API） |
| Vite | 构建工具 |
| TypeScript | 类型安全 |
| Vue Router | 前端路由与导航 |
| Pinia | 状态管理 |
| Axios | HTTP 请求 |
| JSON Server | Mock 后端数据服务 |
| ECharts | 数据可视化（趋势看板） |

## 3. 核心功能

- **首页与导航** — 首页展示四类业务入口卡片，全局导航支持页面切换
- **二手交易** — 浏览二手商品列表，支持关键词搜索、分类筛选、价格排序
- **失物招领** — 浏览失物与招领信息，支持按类型（失物/招领）筛选
- **拼单搭子** — 浏览拼单信息，查看拼单进度，支持按状态筛选
- **跑腿委托** — 浏览跑腿委托，查看路线信息，支持按状态筛选
- **信息发布** — 支持四类信息发布，含表单校验和内容违规检测
- **详情页** — 查看信息详情，支持收藏和加入购物车
- **用户中心** — 查看个人资料、我的发布、我的收藏、我参与的拼单
- **收藏功能** — 列表页和详情页支持收藏/取消收藏（Pinia 状态管理）
- **购物车** — 右下角浮动购物车，支持添加/移除物品
- **搜索与筛选** — 各业务页面支持关键词搜索和分类/状态筛选
- **状态反馈** — 加载中（LoadingState）、空数据（EmptyState）、错误（ErrorState）三种状态全覆盖
- **模拟登录注册** — 使用 localStorage 持久化的前端模拟登录/注册流程
- **趋势看板** — ECharts 数据可视化，展示发布趋势、分类占比和状态分布

## 4. 项目运行

### 安装依赖

```bash
npm install
```

### 启动 Mock 服务（终端 1）

```bash
npm run mock
```

Mock 服务运行在 `http://localhost:3001`。

### 启动前端项目（终端 2）

```bash
npm run dev
```

前端项目运行在 `http://localhost:5173`。

### 构建项目

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

## 5. 项目目录说明

```
campus-market-seed
├── db.json                    Mock 数据（JSON Server）
├── src
│   ├── api/                   接口请求模块
│   │   ├── http.ts            Axios 基础实例
│   │   ├── secondHand.ts      二手交易 API
│   │   ├── lostFound.ts       失物招领 API
│   │   ├── groupBuy.ts        拼单搭子 API
│   │   ├── errand.ts          跑腿委托 API
│   │   ├── user.ts            用户 API
│   │   └── message.ts         消息 API
│   ├── components/            公共组件
│   │   ├── AppHeader.vue      顶部导航栏
│   │   ├── AppLayout.vue      全局布局
│   │   ├── AppNav.vue         侧边导航
│   │   ├── ItemCard.vue       通用卡片组件
│   │   ├── EmptyState.vue     空状态提示
│   │   ├── ErrorState.vue     错误状态提示
│   │   ├── LoadingState.vue   加载状态提示
│   │   ├── SearchBar.vue      搜索栏组件
│   │   ├── FormField.vue      表单字段组件
│   │   ├── CartFloat.vue      购物车浮动组件
│   │   └── ViolationDialog.vue 违规检测弹窗
│   ├── composables/
│   │   └── useAsync.ts        通用异步状态管理
│   ├── router/
│   │   └── index.ts           路由配置
│   ├── stores/
│   │   ├── user.ts            用户状态
│   │   ├── favorite.ts        收藏状态
│   │   └── cart.ts            购物车状态
│   ├── utils/
│   │   └── contentFilter.ts   内容违规检测
│   ├── views/                 页面组件
│   │   ├── HomeView.vue       首页
│   │   ├── TradeView.vue      二手交易
│   │   ├── LostFoundView.vue  失物招领
│   │   ├── GroupBuyView.vue   拼单搭子
│   │   ├── ErrandView.vue     跑腿委托
│   │   ├── PublishView.vue    信息发布
│   │   ├── DetailView.vue     详情页
│   │   ├── UserCenterView.vue 用户中心
│   │   ├── ProfileView.vue    个人中心
│   │   ├── MessageView.vue    消息中心
│   │   ├── LoginView.vue      登录
│   │   ├── RegisterView.vue   注册
│   │   ├── BoardView.vue      统计看板
│   │   ├── DashboardView.vue  数据看板（ECharts）
│   │   └── MarketListView.vue 集市列表
│   ├── App.vue                根组件
│   └── main.ts                应用入口
├── docs/
│   ├── evidence/              每日证据卡（Day1—Day7）
│   ├── ai/                    AI 协作记录
│   └── guide/                 使用指南
├── CHECK_REPORT.md            检测报告
├── package.json
└── README.md
```

## 6. 每日开发记录

| 日期 | 主要内容 |
|------|---------|
| Day1 | 项目启动与业务梳理 — 技术栈选型、页面清单、项目初始化 |
| Day2 | 页面骨架与路由导航 — 创建页面占位、配置路由、导航布局 |
| Day3 | Mock 数据建模与列表渲染 — 设计 db.json、API 封装、四类业务列表页 |
| Day4 | 发布表单与数据新增 — 表单校验、内容违规检测、数据提交 |
| Day5 | 状态管理与用户中心 — Pinia Store（用户/收藏/购物车）、个人中心 |
| Day6 | 交互优化与体验完善 — 注册登录、搜索筛选、收藏按钮、代码清理、导航一致性 |
| Day7 | 综合验收与项目展示 — 功能走查、构建检查、文档完善、证据归档、AI 复盘 |

## 7. AI 协作说明

本项目在开发过程中使用 AI Coding 工具辅助完成了页面骨架搭建、Mock 数据生成、API 接口封装、表单校验逻辑、状态管理设计、交互优化和文档整理。

开发者对 AI 生成的所有内容进行了人工审查、修改和取舍：
- 检查数据结构是否贴合校园业务场景
- 判断 AI 设计是否过度（如组件抽象层级）
- 修复 AI 无法主动发现的类型安全问题
- 筛选 AI 建议，拒绝超出项目范围的功能（如 JWT、路由守卫、密码加密）
- 确保文档和证据卡反映真实开发过程

具体协作过程记录在 `docs/ai/AI_Collaboration_Card.md` 和各日证据卡中。

## 8. 项目不足与改进方向

- 当前使用 JSON Server 模拟后端，非真实后端服务
- 用户登录是前端模拟的，非真实认证系统
- 收藏和购物车数据存储在 Pinia 中，刷新页面后丢失
- 图片上传功能尚未实现
- 搜索功能为前端关键词匹配，不支持模糊搜索
- 页面样式和响应式布局仍有优化空间
- DashboardView 因引入 ECharts 导致打包体积较大（约 568KB）

## License

本项目仅用于《校园轻集市》课程教学与实践。
