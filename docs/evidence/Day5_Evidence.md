# Day5 Evidence — 状态管理与用户中心

## 1. 今日完成内容

今天使用 Pinia 完成了三个全局状态 Store 的设计与实现：

- **user.ts**：管理当前登录用户信息（用户名、学院、年级、头像、登录状态），被导航栏、发布页、个人中心、路由守卫等多个位置使用
- **favorite.ts**：管理收藏状态（收藏列表、添加/取消/切换收藏、判断已收藏），被四个业务列表页、详情页和个人中心使用
- **cart.ts**：管理购物车（临时意向物品），提供浮动图标组件 CartFloat.vue，右下角按钮 + 抽屉面板

此外还实现了发布管理（标记完成/删除）、批量收藏管理（多选模式）、快速切换用户（下拉菜单）、购物车跳转详情页等进阶功能。

---

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要 getter | 主要方法 |
|---|---|---|---|---|
| `src/stores/user.ts` | 当前用户信息 | `isLoggedIn`、`currentUser`（name/college/grade/avatar/bio） | `displayName`、`userDescription` | `updateProfile`、`login`、`logout` |
| `src/stores/favorite.ts` | 收藏状态 | `favorites`（type/itemId/title/addedAt） | `count`、`countByType` | `isFavorited`、`addFavorite`、`removeFavorite`、`toggleFavorite`、`getFavoritesByType`、`clearAll` |
| `src/stores/cart.ts` | 购物车 | `items`（type/itemId/title/price/location/addedAt） | `count`、`countByType` | `isInCart`、`addToCart`、`removeFromCart`、`toggleCart`、`removeBatch`、`clearCart` |

user.ts 采用 Options API 风格（`state`/`getters`/`actions`），favorite.ts 采用 Composition API 风格，cart.ts 采用 Options API 风格。

---

## 3. 状态边界说明

**放入 Store 的数据：**

| 数据 | Store | 原因 |
|---|---|---|
| 当前用户信息 | user.ts | 导航栏、发布页、个人中心、路由守卫都需要 |
| 收藏列表 | favorite.ts | 四个列表页 + 详情页 + 个人中心都需要 |
| 购物车 | cart.ts | 列表页 → 浮动组件 → 详情页跨页面共享 |

**没有放入 Store 的数据：**

| 数据 | 存放位置 | 原因 |
|---|---|---|
| 发布表单输入（form/errors） | PublishView.vue 组件内 | 仅属于发布页面，无跨页面共享需求 |
| 二手列表数据（items/searchQuery/sortBy） | TradeView.vue 组件内 | 仅该页面使用 |
| 失物筛选状态（activeTab/searchQuery） | LostFoundView.vue 组件内 | 仅该页面使用 |
| 违规检测结果（filterResult/showDialog） | PublishView.vue 组件内 | 仅属于发布流程 |
| 页面 Tab 切换状态（activeTab） | ProfileView/UserCenterView 组件内 | 仅影响当前页面 |

**核心原则：Store 存放跨页面/跨组件共享的状态，单个页面的临时状态留在组件内部。**

---

## 4. 页面使用记录

| 页面/组件 | 使用的 Store | 读取/写入 |
|---|---|---|
| `AppLayout.vue` | userStore + cartStore | 监听用户切换 → 清空购物车 |
| `TradeView.vue` | favoriteStore + cartStore | 收藏 + 购物车按钮 |
| `LostFoundView.vue` | favoriteStore + cartStore | 同上 |
| `GroupBuyView.vue` | favoriteStore + cartStore | 同上 |
| `ErrandView.vue` | favoriteStore + cartStore | 同上 |
| `DetailView.vue` | favoriteStore + cartStore | 收藏 + 加入购物车按钮 |
| `PublishView.vue` | userStore | `publisherId` 和 `publisher` 从 Store 读取 |
| `ProfileView.vue` | userStore + favoriteStore | 用户资料 + 收藏 Tab + 发布管理 |
| `UserCenterView.vue` | userStore + favoriteStore | 同上 |
| `CartFloat.vue` | cartStore | 浮动图标 + 抽屉面板 |
| `MarketListView.vue` | （无） | 仅数据展示，已过滤已完成项 |
| `MessageView.vue` | （无） | 使用消息 API，不涉及共享状态 |

---

## 5. AI 协作记录

**使用的 AI 工具：** Claude Code（Claude Opus 模型）

**核心提示词：**
- "使用 Pinia 创建用户状态 Store，模拟当前用户信息"
- "创建收藏 Store，在二手交易列表中实现收藏和取消收藏"
- "在个人中心展示用户资料和我的收藏"
- "发布页面中的 publisher 字段改为读取当前用户"
- "添加购物车功能，右下角浮动图标"
- "我的发布需要编辑管理功能"
- "收藏需要批量管理"
- 以及 6 轮交互反馈打磨指令

**AI 生成内容：**
- 3 个 Pinia Store 完整代码（user.ts / favorite.ts / cart.ts）
- CartFloat.vue 浮动购物车组件
- 路由、AppHeader、AppLayout 的 Store 集成
- 4 个列表页 + 详情页的收藏和购物车按钮代码
- ProfileView / UserCenterView 的完整重构（API 数据 + Store 联动）
- 发布管理（markDone / deletePost）和批量管理逻辑
- db.json 的 favorites 表扩展和 messages 表扩展
- 用户切换下拉菜单
- API 端口修正（3000 → 3001）

**AI 生成内容中的不足之处：**
1. 收藏渲染时默认显示固定"已收藏"文本，未考虑交叉查询实时状态
2. 批量管理 checkbox 默认一直可见，交互粗糙
3. 标记完成后未过滤列表视图中的已完成项
4. 购物车物品不可点击跳转详情页
5. 用户切换仅支持循环点击，不支持快速选择
6. 切换用户后购物车未清空

上述不足均已通过人工反馈后由 AI 修复。

---

## 6. 人工调整内容

主要人工调整项：

| 调整项 | 说明 |
|---|---|
| 删除复杂登录系统 | Day5 使用模拟用户，不接入 JWT / OAuth / 密码验证 |
| 删除 JWT 权限逻辑 | Store 不含 token、refresh、权限角色 |
| user.ts 风格迁移 | 从 Composition API 重写为 Options API，对齐推荐写法 |
| 全局 API 引用更新 | `nickname` → `name`、`setUser` → `updateProfile`、`avatarInitial` → `name.charAt(0)` |
| 移除冗余代码 | router.beforeEach 默认用户设置（Store 已自带）、AppHeader 重复用户标签（导航已有"我的"） |
| 批量交互改进 | 添加 `batchMode` 开关，checkbox 仅在多选模式下显示 |
| 收藏实时状态 | 添加 `allItems` Map，交叉查询 API 数据获取物品当前状态 |
| 购物车跳转 | 将 `<div>` 改为 `<RouterLink>`，移除按钮加事件阻止 |
| 切换用户清空购物车 | 在 AppLayout 中 watch `currentUser.id` → `clearCart()` |
| 已完成列表过滤 | 在所有列表视图的 computed 中排除已完成状态 |

---

## 7. 测试记录

**测试 1：收藏完整流程**

1. 进入二手交易页面，在"考研数学复习全书"卡片上点击 🤍 收藏按钮
2. 按钮文字从 🤍 变为 ❤️，表示已收藏
3. 点击导航栏"我的"，进入个人中心
4. 切换到"我的收藏"Tab，列表中出现了"考研数学复习全书"，状态显示为"在售"
5. 点击该收藏项的"取消收藏"按钮，该条目从收藏列表消失
6. 返回二手交易页面，该物品的按钮已恢复为 🤍

**测试 2：发布人来源验证**

1. 在个人中心点击"校园用户 ▾"下拉菜单，选择"计算机学院小明"
2. 导航栏切换到"发布"，查看发布表单
3. 填写标题"测试二手物品"，选择类型为二手交易，填写描述
4. 点击发布，打开浏览器 DevTools Network 面板
5. 发出的 POST 请求中 `publisherId: 2`，`publisher: "计算机学院小明"`——与当前 Store 用户一致

**测试 3：标记完成 + 列表消失**

1. 切换到用户"校园用户"（id=1）
2. 进入个人中心 → "我发布的"Tab
3. 找到之前发布的测试数据，点击 ✓ 按钮
4. 状态变为"已售"，✓ 按钮消失
5. 导航到二手交易列表页，刷新，"已售"物品已不在列表中

---

## 8. 遇到的问题与解决方法

**问题 1：页面出现 Network Error**

现象：进入任意列表页都提示 Network Error，API 请求全部失败。

排查：`curl localhost:3000` 无响应，`curl localhost:3001` 返回 200。

原因：项目 API 配置的 baseURL 为 `http://localhost:3000`，但 JSON Server 实际启动在 3001 端口（用户使用 `pnpm mock` 命令）。

解决：将 `src/api/index.ts` 和 `src/api/http.ts` 的 API_BASE 从 3000 改为 3001。

**问题 2：切换用户后"我的发布"不更新**

现象：下拉选择新用户后，用户卡片更新了，但"我发布的"列表仍是旧用户的数据。

原因：数据在 `onMounted` 中获取一次，切换用户不会触发重新拉取。

解决：添加 `watch(() => store.currentUser.id, () => execute())`，用户 ID 变化时自动重新拉取并筛选。

**问题 3：AI 首次生成的 userStore 与推荐写法不一致**

现象：AI 使用 Composition API（ref/computed/function）创建了 user.ts，但推荐写法要求 Options API（state/getters/actions）。

解决：要求 AI 按推荐写法重写，并同步更新所有引用文件的 API 调用。

---

## 9. 今日反思

Pinia 状态管理对多页面前端应用的核心价值在于：**消除 props 层层传递和重复数据定义**。Day5 之前，用户信息写在 router 守卫里、发布页写死 `publisherId: 1`、个人中心写死"张三"——同一份数据散落在 5 个地方，修改一处需要同步四处。引入 Pinia 后，userStore 成为唯一的用户数据源，导航栏读 `displayName`、发布页读 `currentUser.id`、个人中心读 `currentUser.college`——底层数据一变，所有消费方自动响应。

状态边界判断是今天最重要的学习点。不是所有数据都该进 Store：PublishView 的表单校验错误留在组件内，TradeView 的搜索关键词留在组件内——它们不需要跨页面共享。如果把什么都往 Store 塞，Store 会变成一个"全局垃圾桶"，定位 bug 时不知道数据从哪来、谁改的。**Store 设计的第一原则不是"能放就放"，而是"必须共享才放"。**

用户中心是 Store 的集大成者——一个页面同时消费 userStore（用户资料）和 favoriteStore（收藏列表）两个数据源，还有自己的本地状态（activeTab）。这种"全局状态 + 本地状态"的混合模式是多页面前端应用的常态。

AI 协作方面：AI 能快速生成 3 个 Store 的完整代码、全局组件的模板、所有页面的按钮集成——这些机械性工作人做需要两小时，AI 十分钟完成。但 AI 有三个明显盲区：（1）不会主动考虑数据实时性（收藏应该显示物品当前状态而非固定"已收藏"）；（2）不会主动优化交互细节（批量管理 checkbox 默认全显）；（3）不会主动建立数据间关联（标记完成后列表应过滤）。"人体验 + 反馈 + AI 修复"的循环是今天最高效的工作模式。
