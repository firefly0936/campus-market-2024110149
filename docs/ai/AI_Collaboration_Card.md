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
