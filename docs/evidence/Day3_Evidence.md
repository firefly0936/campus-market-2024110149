# Day3 Evidence - Mock 数据建模与列表渲染

## 1. 今日完成内容

今天完成了从 Mock 数据设计到页面列表渲染的完整数据链路：

- **Mock 数据文件**（`db.json`）：设计了 6 类业务数据集合，共 30 条记录，覆盖二手交易、失物招领、拼单搭子、跑腿委托、用户和消息
- **Axios 封装**（`src/api/http.ts`）：创建了基础请求实例，配置 baseURL 和 timeout
- **业务 API 文件**（`src/api/secondHand.ts`、`lostFound.ts`、`groupBuy.ts`、`errand.ts`）：四个业务模块均包含 TypeScript 接口定义和完整 CRUD 方法
- **通用组件**：`ItemCard.vue`（列表卡片）和 `EmptyState.vue`（空状态提示）
- **四个核心页面**：TradeView、LostFoundView、GroupBuyView、ErrandView 均完成数据获取、筛选搜索和列表渲染

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
|---|---|---|---|
| secondHand | 二手交易 | title、price、category、condition、tradeLocation、status | 展示二手商品列表 |
| lostAndFound | 失物招领 | title、type、location、lostDate、contact、status | 展示失物和招领信息 |
| groupBuy | 拼单搭子 | title、targetCount、currentCount、deadline、meetingLocation、status | 展示拼单和搭子信息 |
| errand | 跑腿委托 | title、reward、pickupLocation、deliveryLocation、expectedTime、status | 展示跑腿任务列表 |
| users | 用户身份 | nickname、avatar、createdAt | 关联发布者信息 |
| messages | 消息通知 | fromId、toId、content、relatedType、relatedId、read | 消息中心数据源 |

## 3. 我的设计

**为什么二手交易需要 price 和 condition？**

二手交易的核心是"物品 + 价格"。price 是买家最关心的字段——没有价格就无法做筛选（如"50 元以下"）和排序（价格从低到高）。condition（成色）是二手商品的信任基础——"九成新"和"六成新"直接影响买家的购买决策。另外，我增加了 category 字段（电子产品/教材教辅/出行工具/生活用品），方便后续做分类筛选；tradeLocation 用于约定线下交易地点，贴近校园实际场景。

**为什么失物招领需要 type 字段？**

失物招领页面实际承载两类完全相反的需求：丢了东西找人帮忙找（失物），以及捡到东西找失主（招领）。type 字段用"失物"和"招领"两个值区分这两种场景，页面据此显示不同颜色的徽章（红色失物/绿色招领），让用户一眼就能区分。location 和 lostDate 帮助失主快速判断是否是自己丢失的物品。

**为什么拼单搭子需要 targetCount 和 currentCount？**

拼单的核心逻辑是"凑人数"。targetCount 是成团门槛，currentCount 是当前进度。两个字段配合可以计算进度百分比并渲染进度条，让用户直观看到还差几人成团。deadline 制造紧迫感——过了截止时间还没成团就失效。meetingLocation 用于约定线下碰头地点。

**为什么跑腿委托需要 pickupLocation、deliveryLocation 和 reward？**

跑腿的本质是"从 A 到 B 的位移服务"。pickupLocation（取件地）和 deliveryLocation（送达地）定义了任务路线，页面用箭头连接两地点形成路线可视化。reward（报酬）区分有偿委托和免费帮忙——有偿显示金额（如 ¥25），免费显示"免费帮忙"绿色标签。expectedTime 是截止时间，接单者需要在此时间前完成任务。

## 4. AI 设计

AI 工具（Claude Code）在本日生成了以下内容：

- **db.json 全部数据**：6 类集合共 30 条记录，包括每条数据的标题、描述、价格等具体内容。AI 生成的数据贴合校园场景（如图书馆、食堂、宿舍楼），描述自然通顺
- **API 模块文件**：secondHand.ts、lostFound.ts、groupBuy.ts、errand.ts 四个文件的接口定义和 CRUD 函数，包含完整的 TypeScript 类型注解
- **Axios 封装文件**：http.ts 的基础请求实例
- **四个列表页面**：TradeView、LostFoundView、GroupBuyView、ErrandView 的完整 `<script setup>` + `<template>` + `<style scoped>` 代码，包含搜索、筛选、排序、loading/empty/normal 三种状态
- **ItemCard.vue 和 EmptyState.vue** 两个通用组件

AI 生成内容中存在的问题：
1. AI 同时生成了 `src/api/index.ts`（端口 3000）和 `src/api/http.ts`（端口 3001），两个文件创建了不同的 axios 实例但实际只用到了 http.ts，index.ts 是冗余的
2. AI 生成的 ItemCard.vue 组件设计了插槽机制但四个视图页面并未使用它——各视图使用了各自的内联卡片样式（trade-card、lf-card、gb-card、errand-card），组件与视图之间存在脱节
3. AI 初始生成的某些字段名使用了英文复数形式（如 `images` 数组），而 JSON Server 的 RESTful 路由基于集合名，需要确保一致性

## 5. 最终调整

我对 AI 生成的内容做了以下人工修改和判断：

1. **数据字段确认**：逐一审查了 db.json 中四个业务集合的字段设计，确认每类数据的关键业务字段不缺不漏。例如确认 secondHand 必须有 price 和 condition，groupBuy 必须有 targetCount 和 currentCount
2. **数据条数确认**：确认每类业务数据至少 5 条，确保列表页有足够的展示内容。最终 secondHand 6 条、lostAndFound 6 条、groupBuy 6 条、errand 6 条
3. **状态值覆盖确认**：确认 Mock 数据覆盖了多种业务状态——secondHand 有"在售"和"已售"，errand 有"待接单"和"已接单"，lostAndFound 有"未解决"和"已解决"，groupBuy 有不同进度（2/6 到 8/10）。这些状态值是页面筛选逻辑的测试基础
4. **页面三态覆盖确认**：确认四个核心页面都正确处理了 loading（数据加载中）、empty（无数据时使用 EmptyState 组件）、normal（正常数据展示）三种状态
5. **首页导航入口确认**：确认首页 HomeView 中有通往四个业务页面的入口卡片，用户可以从首页进入各列表页
6. **保留 ItemCard.vue 但不强制使用**：ItemCard 作为通用卡片组件保留在项目中供后续重构使用，当前各视图的内联卡片样式先保持不变——每个业务场景的卡片视觉差异较大（价格展示、进度条、路线、徽章等），强行统一反而不自然

## 6. 遇到的问题与解决方法

**问题：JSON Server 端口不一致导致请求失败**

项目中存在两个 axios 实例：`src/api/http.ts` 指向 `localhost:3001`，`src/api/index.ts` 指向 `localhost:3000`。`package.json` 中 `dev:server` 脚本启动 JSON Server 在 3000 端口，而 `mock` 脚本启动在 3001 端口。四个业务 API 文件都导入 http.ts（3001），但如果只运行了 `pnpm dev:server`（3000），页面请求会因端口不匹配而失败。

**解决方法**：明确使用 `pnpm mock`（端口 3001）作为 Day3 的 mock 数据服务。启动命令为 `pnpm mock`（单独启动 JSON Server）或 `pnpm dev:all`（同时启动前端和 JSON Server，但 dev:all 中 dev:server 用的是 3000 端口）。实际开发中，先用 `pnpm mock` 启动 JSON Server 在 3001 端口，再用 `pnpm dev` 启动 Vite 前端，两个终端各司其职，确保请求通路正常。

## 7. 今日反思

**Mock 数据**建模、**JSON Server** 接口请求和**列表渲染**构成了前端开发的"数据轴线"——这是从后端到前端的完整数据链路。今天的工作让我认识到：

第一，Mock 数据不是"随便写几条假数据"，而是**业务建模的具象化**。db.json 中的字段设计直接决定了 TypeScript 接口的形状、API 返回值的类型、以及页面能展示什么信息。如果 Mock 数据阶段少了一个 status 字段，后续的"待接单/已接单"筛选就无从做起。

第二，JSON Server 让我们在没有真实后端的情况下就能跑通完整的"请求 → 响应 → 渲染"流程。这种零配置的 RESTful API 模拟方式，让前端开发者可以完全专注于 Vue3 的组件开发和数据流管理，不被后端开发进度阻塞。

第三，列表渲染是前端最常见的 UI 模式，但它不仅仅是 `v-for` 循环——搜索、筛选、排序、loading 态、empty 态、error 态，每多处理一种状态，页面的用户体验就提升一个档次。今天四个页面覆盖了 loading/empty/normal 三种状态，这是响应式数据驱动视图的工程实践。

总结：数据建模决定数据结构，接口封装决定数据通路，列表渲染决定数据呈现——三层环环相扣，任何一层出问题都会导致页面"白屏"或"数据不显示"。今天把这根数据轴线打通了，后续的详情页、发布页、消息页就有了坚实的数据基础。
