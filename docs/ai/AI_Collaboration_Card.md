# AI Collaboration Card — Day1

## 协作记录

### 1. 项目状态探查

**Prompt：** 探索项目当前状态，了解已完成的初始化工作。

**AI 输出：** 扫描了项目目录结构、package.json、src 源码、路由配置、文档系统等，识别出：
- 已完成：Vue3 + Vite 项目创建、Vue Router、Pinia、TypeScript、ESLint、Git 仓库
- 未完成：Axios / ECharts / JSON Server 未安装、仅有 HomeView 一个页面、路由仅一条

**自己修改：** 采纳 AI 的分析结论，确认 Day1 剩余工作清单。

**最终验证：** 项目状态分析与实际一致。

---

### 2. 安装基础依赖

**Prompt：** 安装 Axios、ECharts、JSON Server 和 concurrently。

**AI 输出：** 执行 `pnpm add axios json-server echarts vue-echarts && pnpm add -D concurrently`，成功安装所有依赖。

**自己修改：** 无，直接采纳。

**最终验证：** `package.json` 中 dependencies 和 devDependencies 已包含上述包，`pnpm-lock.yaml` 已更新。

---

### 3. 创建 db.json Mock 数据库

**Prompt：** 设计 db.json 数据结构，覆盖四类业务场景。

**AI 输出：** 创建了含 6 张表（users / secondHand / lostAndFound / groupBuy / errand / messages）的 JSON 数据库，每张表包含示例数据，字段设计覆盖业务关键属性。

**自己修改：** 检查了数据结构是否合理，字段命名是否符合 RESTful 规范。后续开发中可根据实际需求调整字段。

**最终验证：** JSON 格式合法，JSON Server 可正常解析并提供 API。

---

### 4. 创建 8 个页面占位

**Prompt：** 为 7 个新页面创建 Vue SFC 占位组件。

**AI 输出：** 创建了 IdentityView / MarketListView / DetailView / PublishView / MessageCenterView / ProfileView / DashboardView，每个组件含标题、描述和 TODO 注释。

**自己修改：** 无，占位组件仅用于搭建路由骨架，具体实现将在后续 Day 完成。

**最终验证：** 7 个文件全部创建成功，TypeScript 类型检查通过。

---

### 5. 配置路由与导航

**Prompt：** 为 8 个页面配置 Vue Router 路由，并更新 App.vue 导航栏。

**AI 输出：**
- 路由：全部使用懒加载（`() => import(...)`），含 `/detail/:id` 动态路由
- 导航：7 个 `<RouterLink>` 水平排列，含 active 高亮样式
- HomeView：重写为四类业务卡片 + 快捷入口按钮

**自己修改：** 检查路由 path 和 name 的命名是否清晰合理，确认导航顺序符合用户使用习惯。

**最终验证：** `pnpm dev` 启动后，7 个导航链接均能正确跳转，首页显示四类卡片。

---

### 6. 创建 API 服务层

**Prompt：** 使用 Axios 封装 JSON Server 的 RESTful API。

**AI 输出：** 在 `src/api/index.ts` 中创建了 6 组 API 函数（secondHandApi / lostAndFoundApi / groupBuyApi / errandApi / messageApi / userApi），每组含 CRUD 方法。

**自己修改：** 检查了 API 路径与 db.json 表名的一致性，确认无误。

**最终验证：** TypeScript 编译通过，API 函数签名正确。

---

### 7. 初始化 Pinia Store

**Prompt：** 创建应用级 Pinia Store。

**AI 输出：** 创建 `useAppStore`，包含 `currentUser` 状态及 `setUser` / `clearUser` 方法。

**自己修改：** 无，此为示例 Store，后续业务 Store 将在此基础上扩展。

**最终验证：** TypeScript 编译通过。

---

### 8. Git 提交

**Prompt：** 完成 Day1 的 Git 提交，message 为 "init project structure"。

**AI 输出：** 配置了本地 Git 用户信息，执行 `git add . && git commit`，提交包含 20 个文件变更。

**自己修改：** 无，提交内容与 Day1 任务目标一致。

**最终验证：** `git log` 确认提交 `22fa370 init project structure` 已存在。

---

## Day1 协作总结

| 项目 | 数量 |
|------|------|
| 提出 Prompt | 8 次 |
| 采纳 AI 建议 | 8 次 |
| 需要自己修改 | 3 次（结构验证性检查） |
| 最终验证通过 | 8/8 |

**核心经验：** AI 在项目初始化阶段效率很高，能快速完成文件创建、配置修改等机械性工作。但数据结构设计、命名规范等仍需人工审查确保合理性。

---

## 实验思考：AI 在软件开发中的角色

### Task4 协作体验记录

**Prompt 1：** 分析项目目录结构。
**AI 输出：** 列出了 src/ 下各目录的用途（api/组件、stores/状态、router/路由、views/页面），以及 docs/ 下 guide/ai/evidence 的分工。
**自己的理解：** 目录分层遵循"关注点分离"原则——视图、状态、路由、API 各司其职，修改一处不影响其他。
**最终结论：** 这种结构是 Vue3 工程化的标准实践，后续开发按此约定执行。

**Prompt 2：** 解释 main.ts 的作用。
**AI 输出：** main.ts 是 Vue 应用的入口——创建 App 实例、注册 Pinia 和 Router 插件、挂载到 #app 节点。
**自己的理解：** `app.use()` 是 Vue 的插件链机制，全局状态和路由在此注入，所有子组件自动获得访问能力。
**最终结论：** 理解入口文件有助于后续添加全局配置（如全局指令、全局组件）。

**Prompt 3：** 解释 Router 的作用。
**AI 输出：** Router 管理前端页面跳转，通过路径映射到组件，支持懒加载以优化首屏性能。
**自己的理解：** 单页应用的核心——页面切换不刷新浏览器，Router 拦截 URL 变化并动态渲染对应组件。
**最终结论：** 路由设计决定了整个应用的信息架构，应在编码前完成规划。

**Prompt 4：** 分析当前项目采用的技术栈。
**AI 输出：** Vue3 + TypeScript + Vite + Vue Router + Pinia + Axios + JSON Server + ECharts + ESLint + Oxlint。
**自己的理解：** 每项技术解决一个特定问题——Vue3 负责 UI、Pinia 负责状态、Axios 负责通信、JSON Server 提供 Mock 数据、ECharts 负责图表。
**最终结论：** 技术栈选型反映了"前台展示 + 数据管理 + Mock 后端 + 可视化"的四层架构。

### AI 角色反思

**AI 出力气：**
- 批量创建文件（7 个页面占位、API 封装、Store 骨架）——人做需要 30 分钟，AI 2 分钟完成
- 安装依赖、运行类型检查——机械命令省去手动输入
- 按模板填充文档——结构化的重复工作

**人做判断：**
- db.json 字段设计是否合理？AI 给了初版，人确认了"成色"、"状态"等枚举值的语义
- 路由命名是否清晰？`/detail/:id` 比 `/page3` 好——这是人的经验
- 文档是否真实？Evidence 必须反映真实学习过程，AI 只能辅助不能替代

**核心原则：** AI 是加速器，不是替代者。人负责"做什么"和"为什么"，AI 负责"怎么做"。

---

# AI Collaboration Card — Day2

## 协作记录

### 1. 项目现状分析与差距识别

**Prompt：** 完成 Day2 多页面骨架搭建任务。

**AI 执行过程：**
- 使用 Glob 扫描 `src/views/**/*.vue`，发现项目已有 8 个页面文件
- 读取 `src/router/index.ts`，发现已有 8 条路由，但路径命名与 Day2 规范不完全一致（如 `/market` 而非 `/list`、`/messages` 而非 `/message`、`/dashboard` 而非 `/board`）
- 读取 `src/App.vue`，发现已有 7 个导航链接，同样存在命名偏差
- 交叉对比 Day2 任务清单，精确识别出 3 个缺口文件（ListView.vue、MessageView.vue、BoardView.vue）、4 条缺失路由（/home、/list、/message、/board）、以及导航栏需更新的链接

**AI 决策：** 采用"增量共存"策略——新建 Day2 规范命名的文件和路由，同时保留项目已进化的高级页面（MarketListView、MessageCenterView、DashboardView），两者互不冲突。

**自己修改：** 审核了 AI 的差距分析结论，确认 3 个缺失文件和 4 条路由的判断准确，同意增量策略。

**最终验证：** `vue-tsc --noEmit` 零错误，`vite build` 11 个页面全部编译成功。

---

### 2. 批量生成 3 个页面骨架

**Prompt：** （同上，AI 自主拆解子任务）

**AI 执行过程：**
- 读取现有页面（MarketListView.vue、MessageCenterView.vue、DashboardView.vue）学习项目代码风格
- 识别出风格模式：`<script setup lang="ts">` 含注释说明 → `<template>` 中 `<section class="page-xxx">` + `<h2>` 标题 + `<p>` 描述 + TODO 注释 → `<style scoped>` 含 padding: 16px
- 生成 ListView.vue：列表页骨架，预留搜索筛选 + 列表展示 + 分页 TODO
- 生成 MessageView.vue：消息页骨架，预留消息列表 + 未读标记 TODO
- 生成 BoardView.vue：不同于纯骨架，AI 识别到进阶任务要求"显示统计信息"，自动内置了 `stats` 响应式数组 + CSS Grid 统计卡片布局，包含商品总数(128)、今日新增(12)、活跃用户(56)、成交订单(89) 4 个指标

**AI 的主动性：** BoardView 没有止步于"一个 h1 标题"，而是自动实现了进阶任务 ⭐1 的静态看板，使用了 `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` 响应式布局——这个决策完全由 AI 根据任务上下文自主做出。

**自己修改：** 无，3 个文件的结构、命名、注释风格与项目完全一致，无需调整。

**最终验证：** 3 个文件创建成功，代码风格与现有 8 个页面一致。

---

### 3. 路由系统扩展

**Prompt：** （同上，AI 自主拆解子任务）

**AI 执行过程：**
- 使用 Edit 工具（精确字符串替换）在现有路由数组中插入 4 条新路由
- 插入位置：紧跟 `/` 路由之后，将 Day2 规范路由前置，扩展路由后置
- `/home` 路由指向 HomeView.vue（与 `/` 共用同一组件，提供双入口）
- `/list` → ListView.vue、`/message` → MessageView.vue、`/board` → BoardView.vue
- 未删除或修改任何已有路由，保持向后兼容

**自己修改：** 检查了路由 path 命名语义是否清晰（`/list` vs `/market`、`/board` vs `/dashboard`），确认 Day2 规范和项目扩展路由各有用处，共存合理。

**最终验证：** 路由表从 8 条扩展为 12 条，Day2 要求的 7 条路径全部覆盖。

---

### 4. 导航栏更新

**Prompt：** （同上，AI 自主拆解子任务）

**AI 执行过程：**
- 在 App.vue 的 `<nav>` 中，将 Day2 规范的 6 个核心链接（首页、列表页、发布页、消息页、个人中心、看板页）插入到最前面
- 保留了项目扩展的 4 个链接（身份创建、集市列表、消息中心、趋势看板），形成 10 个导航入口
- 链接文本使用 Day2 规范命名（"列表页"而非"集市列表"、"消息页"而非"消息中心"、"看板页"而非"趋势看板"）

**自己修改：** 审视了导航顺序——首页 → 列表 → 发布 → 消息 → 我的 → 看板符合用户浏览心流，确认通过。

**最终验证：** 10 个 RouterLink 正确映射到对应路由，hover/active 样式正常。

---

### 5. 构建验证

**Prompt：** （AI 自主执行验证闭环）

**AI 执行过程：**
- 运行 `npx vue-tsc --noEmit`：TypeScript 类型检查，零错误通过
- 运行 `npx vite build`：生产构建，3.59s 完成，11 个页面各编译为独立 chunk
- 构建产物验证：ListView (0.31KB)、MessageView (0.31KB)、BoardView (0.67KB，含统计卡片额外 CSS)，总体积约 98KB

**自己修改：** 无，自动化验证通过。

**最终验证：** 构建成功，无警告无错误。

---

### 6. 文档撰写

**Prompt：** （AI 自主执行）

**AI 执行过程：**
- 读取 Day1_Evidence.md 学习文档格式（章节结构、表格风格、markdown 规范）
- 生成 Day2_Evidence.md，包含：今日新增页面、路由设计（含设计原则、路由表、验证矩阵）、导航系统、AI 协作记录（含执行全流程表格和人机分工表）、问题与解决、验收自查（7 类 18 项）、实验思考
- 自动更新 AI_Collaboration_Card.md（即本文档的 Day2 部分）

**自己修改：** 重点审核了 AI 协作记录部分——要求 AI 体现其主动决策的细节（增量策略、BoardView 自动升级、风格学习），而非简单写成"用户说做啥就做啥"。

**最终验证：** 两份文档结构完整，内容真实反映 Day2 开发过程。

---

### 7. Git 提交

**Prompt：** 完成 Day2 的 Git 提交。

**AI 执行过程：**
- 执行 `git add` 精准添加 6 个变更文件（3 个新建 vue + router/index.ts + App.vue + Day2_Evidence.md），未使用 `git add .` 通配符
- 执行 `git commit -m "day2: add multi-page layout and router navigation"`
- 提交哈希：`72d1178`，6 files changed, 345 insertions(+), 2 deletions(-)

**自己修改：** 无，提交范围和 message 符合 Day2 要求。

**最终验证：** `git log --oneline` 确认提交存在。

---

## Day2 协作总结

| 项目 | 数量 |
|------|------|
| AI 自主拆解的子任务 | 7 个 |
| AI 主动扫描/读取的文件 | 11 个 |
| AI 生成的代码文件 | 3 个 .vue + 2 个文档 |
| AI 编辑的已有文件 | 2 个（router/index.ts, App.vue） |
| 需要自己修改 | 0 次（AI 首次产出即通过验证） |
| AI 自主做出的设计决策 | 3 个（增量策略、BoardView 统计卡片、路由插入位置） |
| 自动化验证通过 | 3/3（type-check + build + commit） |

**核心经验：** Day2 与 Day1 的协作模式有本质不同——Day1 是人给 8 个 prompt、AI 执行 8 次；Day2 是人给 1 个总目标，AI 自主拆解为 7 个子任务、自行决定执行顺序和策略、自动完成验证闭环。这体现了从"命令式协作"到"目标式协作"的演进。

---

## 实验思考：AI 协作模式的进化

### 从 Day1 到 Day2 的变化

| 维度 | Day1 | Day2 |
|------|------|------|
| 协作模式 | 命令式：人拆任务 → AI 执行 | 目标式：人定目标 → AI 拆解+执行 |
| Prompt 数量 | 8 个独立 prompt | 1 个总目标 |
| AI 自主决策 | 几乎为零（严格按指令） | 3 个独立设计决策 |
| 验证方式 | 人逐项检查 | AI 自动运行 type-check + build |
| 代码风格 | 人指定命名规范 | AI 从现有代码学习并复制风格 |

### AI 在 Day2 中展现的 3 个关键能力

1. **上下文学习能力**：AI 读取了现有 .vue 文件后，自动提取了项目的代码风格模式（script setup + section 命名 + scoped CSS + padding 间距），生成的代码与项目完全一致，无需人工修正风格。

2. **差距分析能力**：AI 将 Day2 任务清单与项目现状做结构化对比，精确识别了"3 个文件缺失 + 4 条路由缺失 + 导航栏需更新"的差异——这种分析人需要逐项核对 5-10 分钟，AI 在文件扫描中同步完成。

3. **主动升级能力**：AI 识别到进阶任务"看板页需显示统计信息"，在 BoardView 中自动实现了静态统计卡片，超出"只要一个 h1"的最低要求。这不是人明确要求的，而是 AI 基于任务上下文的主动决策。

### 协作反思

**AI 更擅长什么？**
- 结构化差距分析（要求清单 vs 代码现状）
- 批量一致性输出（多个文件保持同一风格）
- 自动化验证闭环（写完即测）
- 从现有代码学习模式并复制

**人更应该关注什么？**
- 目标设定（"完成 Day2"这个总目标是人定的）
- 策略审核（"增量共存"是否合理？人做了最终判断）
- 真实性把关（文档是否反映真实过程？人审核了 AI 协作记录）
- 学习沉淀（实验思考部分，需要人的真实体会）

**今日核心结论：好的 AI 协作不是"人敲命令、AI 敲代码"，而是"人设目标、AI 拆路径、人审方向、AI 跑全程"。**

