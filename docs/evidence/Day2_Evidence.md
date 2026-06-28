# Day2 Evidence — 页面骨架与路由导航

## 1. 今日完成内容

今天基于 Vue 3 + TypeScript + Vue Router 项目，完成了三大核心工作：

**公共布局**方面，将原本写在 `App.vue` 中的内联头部和导航代码拆分为三个独立组件：`AppLayout.vue`（整体页面壳，全屏高度 + 灰色背景 + 1200px 居中内容区）、`AppHeader.vue`（顶部栏，左侧品牌 logo "校园轻集市"与 slogan "轻量、可信、面向校园生活"，右侧嵌入导航菜单）、`AppNav.vue`（导航菜单，包含首页 / 集市列表 / 消息 / 我的 / 发布五个入口，其中"发布"使用蓝色填充按钮突出显示）。拆分后 `App.vue` 从原来的 87 行缩减为仅 8 行。

**页面骨架**方面，项目现有 14 个页面组件，覆盖了校园轻集市全部业务场景：首页（四大业务场景入口卡片）、二手交易（含搜索排序和 mock 数据列表）、失物招领、拼单搭子、跑腿委托、集市列表、物品详情（支持 `:id` 参数）、发布信息、消息中心、个人中心、用户中心、数据看板、趋势看板、消息中心（备用）。

**路由导航**方面，配置了 14 条路由，全部使用懒加载，History 模式。修复了路由路径与导航链接不一致的问题（`/messages` → `/message`，`/profile` → `/user`）。首页链接使用 `exact` 精确匹配防止子路由下误高亮。添加了 `router.afterEach` 钩子实现动态页面标题（格式："{页面标题} — 校园轻集市"）。

## 2. 页面与路由清单

| 页面名称 | 路由路径 | 文件位置 |
|---|---|---|
| 首页 | `/` | `src/views/HomeView.vue` |
| 二手交易 | `/trade` | `src/views/TradeView.vue` |
| 失物招领 | `/lost-found` | `src/views/LostFoundView.vue` |
| 拼单搭子 | `/group-buy` | `src/views/GroupBuyView.vue` |
| 跑腿委托 | `/errand` | `src/views/ErrandView.vue` |
| 集市列表 | `/market` | `src/views/MarketListView.vue` |
| 物品详情 | `/detail/:id` | `src/views/DetailView.vue` |
| 发布信息 | `/publish` | `src/views/PublishView.vue` |
| 消息中心 | `/message` | `src/views/MessageView.vue` |
| 个人中心 | `/user` | `src/views/ProfileView.vue` |
| 用户中心 | `/user-center` | `src/views/UserCenterView.vue` |
| 数据看板 | `/board` | `src/views/BoardView.vue` |
| 趋势看板 | `/dashboard` | `src/views/DashboardView.vue` |

**公共布局组件清单：**

| 组件名称 | 文件位置 | 职责 |
|---|---|---|
| AppLayout | `src/components/AppLayout.vue` | 整体页面壳：全屏容器，嵌入 Header + RouterView |
| AppHeader | `src/components/AppHeader.vue` | 顶部栏：品牌展示（logo + slogan）+ 导航菜单 |
| AppNav | `src/components/AppNav.vue` | 导航菜单：5 个入口链接，发布按钮突出显示 |

## 3. AI 协作记录

**使用的 AI 工具**：Claude Code（基于 Anthropic Claude 模型），运行在 VS Code 终端环境中。

**核心提示词**：任务要求为"在 src/components 目录下创建公共布局组件"，并给出了 AppLayout.vue、AppHeader.vue、AppNav.vue 三个组件的具体示例代码模板。后续根据交互反馈逐步调整——"首页内容放在左上角""四大业务场景放在首页里面""发布功能有更显眼的提示""四个功能不显示在右上角"。

**AI 生成的内容**：
- `AppLayout.vue` 全部代码（布局结构 + scoped 样式）
- `AppHeader.vue` 全部代码（品牌区 + 导航集成 + props 默认值）
- `AppNav.vue` 全部代码（导航链接 + 发布按钮样式 + active 高亮规则）
- `App.vue` 重构（从内联布局改为引用 AppLayout）
- `HomeView.vue` 重构（静态卡片改为 RouterLink 可点击卡片，2×2 网格，每卡片独立配色，发布大按钮）
- `router/index.ts` 修改（路径修正 + afterEach 动态标题钩子）

**自己修改、删除和确认的内容**：
- **删除**：从 AppNav 导航栏中移除了"二手交易""失物招领""拼单搭子""跑腿委托"四个链接——这四块已通过首页卡片直接进入，导航栏不再重复展示
- **确认**：路由路径 `/messages` 改为 `/message`、`/profile` 改为 `/user`，与导航链接和用户测试 URL 保持一致
- **确认**：首页链接添加 `exact` 属性——AI 初始生成了 `exact`，经测试确认可解决首页在所有子路由下误高亮的问题
- **确认**：发布按钮使用蓝色填充样式（`background: #2563eb`）——AI 生成的样式符合"更显眼"的要求，无需调整
- **确认**：`router.afterEach` 标题格式——AI 使用了 `{页面标题} — 校园轻集市` 的格式，符合预期

## 4. 遇到的问题与解决方法

**问题 1：导航链接路径与路由不一致**

在测试页面跳转时发现，AppNav 中最初使用的路径为 `/messages`（复数）和 `/profile`，但用户给出的测试 URL 为 `/message`（单数）和 `/user`。虽然 Vite dev server 对未知路径会回退到 `index.html`（返回 200），但 Vue Router 找不到匹配路由会导致 `<RouterView>` 区域空白。

**解决方法**：将路由配置中 `/messages` 统一修改为 `/message`，`/profile` 修改为 `/user`，与 AppNav 导航链接完全对齐。修改后所有 8 个测试 URL 均能正常匹配到对应页面组件。

**问题 2：首页导航链接始终高亮**

AppNav 使用 `.router-link-active` 选择器控制高亮样式，但 Vue Router 的 `router-link-active` 是前缀匹配——`/` 是所有路由的前缀，因此访问任何子页面（如 `/trade`）时首页链接也会被标记为 active 状态。

**解决方法**：在首页 `<RouterLink to="/">` 上添加 `exact` 属性，使其仅在完全匹配 `/` 时才添加 `router-link-active` 类。其余链接保持默认行为（前缀匹配即可，因为 `/trade` 和 `/trade/xxx` 本应同时高亮）。

**问题 3：页面标题无法区分当前页面**

所有页面的 `<title>` 始终显示"校园轻集市"，用户在浏览器标签页中无法区分不同页面。

**解决方法**：在 `router/index.ts` 中添加 `router.afterEach` 钩子，从路由 `meta.title` 读取页面标题，动态设置 `document.title` 为 `{页面标题} — 校园轻集市` 格式。例如访问 `/trade` 时标签页显示"二手交易 — 校园轻集市"。

## 5. 今日反思

**页面骨架**、**路由导航**和**公共布局**是前端项目的三大基础设施，它们共同决定了用户如何在产品中穿行。

页面骨架的作用是"先占位、后填充"——今天 14 个页面组件同时就位后，不同开发者可以并行开发各自负责的页面业务逻辑，不会相互阻塞。而且骨架阶段就能验证所有页面是否可访问，把"跳转不通"这类基础问题消灭在最早阶段。

路由导航是产品的"交通系统"——每条路由对应一个用户故事节点（浏览列表 → 查看详情 → 发布信息 → 收到消息 → 查看个人中心），路由表本身就是产品的功能地图。配置正确的路由意味着用户能按预期路径完成核心操作流程。

公共布局的价值在于"写一次，处处生效"——AppLayout 的 1200px 居中容器、AppHeader 的品牌展示、AppNav 的导航高亮规则，只需在一个地方定义，所有 14 个页面自动继承统一的视觉风格和交互规范。如果哪天要改导航栏的颜色或布局，只需修改 AppNav.vue 一个文件即可全局生效。

AI 在今天的工作中承担了约 80% 的代码生成量（3 个公共组件 + 4 个文件修改），但人工判断在三个关键节点不可或缺：决定导航栏该放哪些链接（业务逻辑决策）、确认路由路径的语义正确性（产品直觉）、验证交互效果的合理性（用户体验判断）。这次协作让我意识到，AI 擅长"根据明确的规范快速生成一致性代码"，但"规范本身是否正确"仍然需要人来把关。
