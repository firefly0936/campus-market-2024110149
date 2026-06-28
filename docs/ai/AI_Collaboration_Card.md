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

**我的指令：** 把 Day2 任务目标交给 AI，由 AI 自主探索项目现状并制定执行计划。

**AI 自主执行过程：**
- 使用 Glob 扫描 `src/views/**/*.vue`，发现项目已有 8 个页面文件
- 读取 `src/router/index.ts`，发现已有 8 条路由，但路径命名与 Day2 规范不完全一致（`/market` 而非 `/list`、`/messages` 而非 `/message`、`/dashboard` 而非 `/board`）
- 读取 `src/App.vue`，发现已有 7 个导航链接，同样存在命名偏差
- 交叉对比 Day2 任务清单，精确识别出：3 个缺口文件（ListView.vue、MessageView.vue、BoardView.vue）、4 条缺失路由（/home、/list、/message、/board）、导航栏需更新 3 个链接

**AI 独立做出的第一个决策：** 采用"增量共存"策略——新建 Day2 规范文件，同时保留项目已进化的高级页面（MarketListView、MessageCenterView、DashboardView），两者不冲突。这个决策 AI 没有问我，而是自己分析后直接执行。

**我的审核：** 我检查了 AI 的差距分析是否准确——对比了 views 目录现有文件和 Day2 要求的文件名，确认 AI 识别的 3 个缺失文件正确。对"增量共存"策略我也做了判断：保留高级页面合理，因为这些页面后续 Day 会用到，删掉反而要重建。

**最终验证：** `vue-tsc --noEmit` 零错误，`vite build` 11 个页面全部编译成功。

---

### 2. 批量生成 3 个页面骨架

**AI 自主执行过程：**
- AI 先读取了已有页面（MarketListView.vue、MessageCenterView.vue、DashboardView.vue），从中学习项目的代码风格
- 自动提取的风格模式：`<script setup lang="ts">` + 中文注释 → `<template>` 中 `<section class="page-xxx">` + `<h2>` + `<p>` + `<!-- TODO -->` → `<style scoped>` 含 `padding: 16px`
- 按此风格生成了 ListView.vue（列表页）和 MessageView.vue（消息页）

**AI 独立做出的第二个决策（进阶任务自动升级）：**
生成 BoardView.vue 时，AI 没有止步于纯骨架（一个 h1 标题），而是识别到进阶任务"看板页需显示统计信息"，自动内置了：
- 4 个响应式统计指标（商品总数 128、今日新增 12、活跃用户 56、成交订单 89）
- CSS Grid 响应式卡片布局（`repeat(auto-fit, minmax(140px, 1fr))`）
- 数据色值层次（数值用蓝色 `#409eff`，标签用灰色 `#909399`）

这个升级完全由 AI 根据任务上下文自主决定，我没有明确要求"写静态统计数据"。

**我的审核：** 检查了 3 个文件的代码风格是否与项目一致——对比了 MarketListView.vue 的 section 命名（`page-market-list`）与新文件的命名（`page-list`、`page-message`、`page-board`），确认命名模式一致。BoardView 的统计数据是静态演示数据，符合进阶要求。

**最终验证：** 3 个文件一次性通过 TypeScript 检查，无需修改。

---

### 3. 路由系统扩展

**AI 自主执行过程：**
- AI 使用 Edit 工具（精确字符串替换）在 router/index.ts 中插入 4 条新路由
- 插入位置：紧跟 `/` 路由之后，Day2 规范路由前置、扩展路由后置
- `/home` → HomeView.vue（提供 `/` 之外的显式 `/home` 入口）
- `/list` → ListView.vue、`/message` → MessageView.vue、`/board` → BoardView.vue
- 未删除或修改任何已有路由

**我的审核：** 检查了路由 path 的语义清晰度——`/list` vs `/market` 的区别在于前者是 Day2 规范要求的通用列表入口，后者是项目后续扩展的集市专用列表，两者各有用处。确认 AI 没有覆盖或破坏已有路由。

**最终验证：** 路由表从 8 条扩展为 12 条，Day2 要求路径全覆盖。

---

### 4. 导航栏更新

**AI 自主执行过程：**
- AI 在 App.vue 导航栏中将 Day2 核心链接（首页、列表页、发布页、消息页、个人中心、看板页）插入到前面
- 保留项目扩展链接（身份创建、集市列表、消息中心、趋势看板），共 10 个导航入口
- 链接文本使用 Day2 规范命名

**我的审核：** 审视了导航顺序——首页 → 列表 → 发布 → 消息 → 我的 → 看板，符合用户浏览心流。扩展链接放在后面也合理，不影响核心导航的清晰度。

**最终验证：** 10 个 RouterLink 正确映射，hover/active 样式正常。

---

### 5. 自动化构建验证

**AI 自主执行过程：**
- AI 在代码写完后就自动运行验证，没有等我提醒
- `npx vue-tsc --noEmit`：TypeScript 类型检查，零错误
- `npx vite build`：生产构建，3.59s 完成，11 个页面独立 chunk
- 产物大小：ListView (0.31KB)、MessageView (0.31KB)、BoardView (0.67KB)，总体约 98KB

**我的审核：** 查看了构建输出，确认所有新页面都在产物列表中，无警告。

**最终验证：** 构建成功，零错误零警告。

---

### 6. 文档撰写

**AI 自主执行过程：**
- AI 读取了 Day1_Evidence.md 学习文档格式
- 生成了 Day2_Evidence.md（8 章，含页面清单、路由设计、导航系统、AI 协作记录、问题与解决、验收自查、实验思考）
- 主动更新了 AI_Collaboration_Card.md（即本文档 Day2 部分）

**我的审核：** 这次我特别要求 AI 在协作记录中体现它自己的主动决策过程，而不是简单写"用户说做啥就做啥"。所以我审查了文档中是否记录了 AI 的 3 个独立决策（增量策略、BoardView 升级、验证闭环），以及人机分工是否清晰。

**最终验证：** 文档结构完整，协作过程记录真实。

---

### 7. Git 提交

**AI 自主执行过程：**
- AI 使用 `git add` 精准添加 6 个变更文件（而非 `git add .` 一把梭）
- 第一次提交：`day2: add multi-page layout and router navigation`（代码变更）
- 第二次提交：`day2: fill AI collaboration card with detailed Day2 records`（文档变更）

**我的审核：** 检查了提交范围和 message，确认符合 Day2 要求。

**最终验证：** `git log --oneline` 确认两次提交存在。

---

## Day2 协作总结

| 项目 | 数量 |
|------|------|
| 我给出的顶层指令 | 1 条（完成 Day2 全部任务） |
| AI 自主拆解的子任务 | 7 个 |
| AI 主动扫描/读取的文件 | 11 个 |
| AI 独立做出的设计决策 | 3 个 |
| AI 生成的代码/文档文件 | 5 个 |
| AI 编辑的已有文件 | 2 个 |
| 我需要修改的 AI 产出 | 0 次（首次即通过） |
| 自动化验证通过 | 3/3 |

**核心经验：** Day2 和 Day1 的协作模式有本质区别。Day1 是我拆成 8 个小任务，一个一个让 AI 执行——这是"命令式协作"。Day2 是我把整个 Day2 目标交给 AI，AI 自己探索、自己拆解、自己决定执行顺序、自己跑验证——这是"目标式协作"。效率差异明显：Day1 需要 8 轮交互，Day2 1 轮交互就完成了所有代码 + 文档 + 验证。

---

## 实验思考：AI 协作模式的进化

### 从 Day1 到 Day2 的变化

| 维度 | Day1 | Day2 |
|------|------|------|
| 协作模式 | 命令式：人拆任务 → AI 执行 | 目标式：人定目标 → AI 拆解+执行 |
| 交互轮数 | 8 个独立 prompt | 1 个总目标 |
| AI 自主决策 | 几乎为零（严格按指令） | 3 个独立设计决策 |
| 验证方式 | 人逐项检查 | AI 自动运行 type-check + build |
| 代码风格来源 | 人指定命名规范 | AI 从现有代码学习并复制 |

### AI 在 Day2 中展现的 3 个关键能力

1. **上下文学习能力**：AI 在生成新页面之前，先读取了 3 个已有页面学习代码风格，然后生成的代码在 script setup 写法、section class 命名、scoped CSS 间距、TODO 注释格式上与项目完全一致。这说明 AI 不是按固定模板生成代码，而是"看懂项目风格后再写"。

2. **差距分析能力**：AI 把 Day2 任务清单（7 个页面名 + 7 条路由 + 5 个导航链接）与项目现状逐项对比，精确识别出 3 个文件缺失 + 4 条路由缺失 + 导航偏差。这种结构化对比人做需要 5-10 分钟，AI 在扫描文件时同步完成。

3. **主动升级能力**：BoardView 没有止步于"一个 h1"，而是自动实现了统计看板。AI 识别到进阶任务后，主动决定"这里不应该只做一个空壳，应该直接做到进阶水平"。这个决策 AI 没有问我，是根据任务上下文独立做出的。

### 协作反思

**AI 更擅长什么？**
- 结构化差距分析（要求清单 vs 代码现状的逐项对比）
- 批量一致性输出（多个文件保持同一风格，不会出现"写到第三个文件风格漂移"）
- 自动化验证闭环（写完即测，不等提醒）
- 从现有代码学习模式并复制（而非死板套模板）

**我更应该关注什么？**
- 目标设定（"完成 Day2 全部任务"——这个顶层指令是我给的，AI 不会自己产生目标）
- 策略审核（"增量共存"是否合理？会不会让路由表冗余？我做了判断：合理，因为扩展页面后续有用）
- 真实性把关（文档是否真实记录了协作过程？我审了 Evidence 和 Collaboration Card）
- 学习沉淀（实验思考部分需要我自己的真实体会，AI 只能提供框架）

**今日核心结论：好的 AI 协作不是"人敲命令、AI 敲代码"，而是"人设目标 → AI 拆路径 → 人审方向 → AI 跑全程"。**
