# Day6 Evidence — 注册登录、交互优化与体验完善

## 1. 今日完成内容

今天完成了两大部分工作：

**Part A — Mock 注册/登录与状态持久化（Task 1-10）：**

1. 在 `db.json` 中重构 `users` 数据资源（username/password/name/college/grade/avatar/bio）
2. 创建 `src/api/user.ts` API 模块（getUsers/getUserByUsername/createUser）
3. 配置 `/login` 和 `/register` 路由
4. 创建 `RegisterView.vue` — 表单校验、用户名查重、POST /users 写入
5. 创建 `LoginView.vue` — 用户名密码校验、Pinia + localStorage 保存
6. 改造 `stores/user.ts` — setLogin/logout/restoreLogin、localStorage 持久化
7. `App.vue` 启动时从 localStorage 恢复登录状态
8. `AppNav.vue` 根据登录状态显示"登录/注册"或"用户名/退出"
9. `PublishView.vue` 未登录时拦截并提示先登录
10. `ProfileView.vue` 和 `UserCenterView.vue` 增加未登录提示

**Part B — 交互体验优化（Task 11-18）：**

11. 为四个列表页面补全搜索/筛选
12. 优化发布表单体验（动态 placeholder、内联错误横幅、提交中禁用）
13. 收藏按钮状态展示优化（emoji 改为文字按钮 + 颜色变化）
14. 导航与页面标题一致性检查及修复
15. 代码清理（删除 4 个文件、10 个未使用导出、3 个死变量）

## 2. 注册登录设计说明

本项目注册/登录功能基于 JSON Server + Pinia + localStorage 实现，仅用于前端实训和状态管理模拟。

**注册流程：**
- 用户填写表单 → 前端校验必填项/密码位数/两次密码一致性
- `getUserByUsername()` 检查用户名是否已存在
- `createUser()` → POST /users 写入 db.json
- 注册成功 → 跳转 /login

**登录流程：**
- 用户填写用户名和密码
- `getUsers()` → GET /users 获取全部用户
- 前端匹配 `username === form.username && password === form.password`
- 匹配成功 → `userStore.setLogin(user)` 保存到 Pinia
- `saveToStorage()` 同步写入 localStorage → 跳转首页

**状态恢复：**
- App.vue onMounted → userStore.restoreLogin()
- 从 localStorage 读取 `campus-market-current-user` → JSON.parse → 恢复到 Pinia

**退出登录：**
- userStore.logout() → currentUser = null, isLoggedIn = false
- localStorage.removeItem('campus-market-current-user')
- 导航栏、个人中心等自动回到未登录态

## 3. 用户数据结构说明

| 字段 | 含义 | 示例 |
|------|------|------|
| username | 用户名（登录用） | student |
| password | 密码（明文，仅 Mock 用） | 123456 |
| name | 显示名称 | 校园用户 |
| college | 学院 | 计算机学院 |
| grade | 年级 | 2023级 |
| avatar | 头像 | 暂为空 |
| bio | 个人简介 | 热爱校园生活 |

db.json 初始包含 5 个测试用户，密码均为 `123456`：student / xiaoming / xiaohong / xiaogang / xiaomei

## 4. 状态持久化说明

**为什么需要 localStorage：**

- Pinia 中的状态存储在内存中，刷新页面后会全部丢失
- 在真实的 Web 应用中，用户登录后刷新页面应当仍保持登录状态
- localStorage 可以将当前用户以 JSON 字符串形式持久化到浏览器中
- App 启动时通过 `restoreLogin()` 从 localStorage 读取并恢复到 Pinia
- 退出登录时必须同时清空 Pinia 和 localStorage，否则刷新后又会恢复登录

**实现细节：**
- 存储 Key：`campus-market-current-user`
- 存储内容：CurrentUser 对象的 JSON 序列化（不含密码，仅 id/username/name/college/grade/avatar/bio）
- userStore 的 `state()` 初始化时自动从 localStorage 加载
- `setLogin()` 写入时同步更新 localStorage
- `logout()` 退出时清除 localStorage

**重要说明：** 本项目只是 Mock 登录，**不是生产级安全方案**。生产环境不会将用户密码明文存储在 db.json 中，也不会将用户信息明文存入 localStorage。

## 5. 页面联动记录

登录状态影响了以下页面和组件：

| 页面/组件 | 未登录时 | 登录后 |
|-----------|---------|--------|
| AppNav 导航栏 | 显示"登录"和"注册"链接 | 显示当前用户名和"退出"按钮 |
| PublishView 发布页 | 点击发布时弹 alert "请先登录"并跳转 `/login` | 正常发布，publisher 来自当前用户 |
| ProfileView 个人中心 | 显示"请先登录后查看个人中心" + "去登录"按钮 | 显示用户资料卡片 + 发布/参与/收藏 Tab |
| UserCenterView 用户中心 | 同上，显示未登录提示 | 显示用户资料 + 统计数据 + 发布/收藏管理 |
| buildPayload() | 不可达（handleSubmit 已拦截） | userId = currentUser.id, publisher = displayName |

## 6. 交互优化记录

| 优化内容 | 涉及文件 | 说明 |
|----------|---------|------|
| 搜索功能 | SearchBar.vue、四个列表页 | 关键词覆盖标题/分类/地点/描述多字段；TradeView 增加分类下拉筛选 |
| 加载状态 | LoadingState.vue、四个列表页 | 请求数据时显示 spinner + 文字提示 |
| 错误状态 | ErrorState.vue、四个列表页 | 请求失败时显示错误信息 + 重试按钮 |
| 空状态 | EmptyState.vue、四个列表页 | 无数据/筛选无结果时显示不同提示文案 |
| 发布按钮反馈 | PublishView.vue | 提交中 disabled + "提交中..."；失败 alert + 红色横幅 |
| 收藏按钮状态 | 四个列表页 | emoji 改为文字"收藏"/"已收藏" + active 蓝底蓝字 |
| 动态 placeholder | PublishView.vue | 标题/地点/描述 placeholder 按发布类型自动切换 |
| 导航一致性 | AppNav、router、MessageView、ProfileView | 8 页面路由/导航/标题全部对齐 |

## 7. AI 协作记录

**使用工具：** Claude Code（CLI + Explore Agent）

**核心提示词：**
1. "在 db.json 中增加 users 数据资源"
2. "创建 user.ts API 模块"
3. "创建 LoginView.vue 和 RegisterView.vue"
4. "改造 userStore 使用 localStorage 持久化"
5. "导航栏根据登录状态显示不同入口"
6. "发布页面未登录时提示先登录"
7. "为二手交易页面增加 loading、empty、error 和搜索功能"
8. "不要加入 JWT、权限路由和复杂安全系统"

**AI 生成内容与人工调整：**

| AI 生成内容 | 人工判断 |
|------------|---------|
| userStore 的 state() 初始化自动从 localStorage 读取 | ✅ 采纳，设计合理 |
| localStorage key 使用常量 STORAGE_KEY | ✅ 采纳 |
| 注册时检查用户名重复 | ✅ 采纳，使用 GET /users?username=xxx |
| 登录时 GET /users 全量查询后前端匹配 | ✅ 采纳（JSON Server 不支持 POST 登录） |
| 登录成功跳转首页 | ✅ 采纳 |
| 未登录拦截使用 window.alert + router.push | ✅ 采纳，简洁直接 |
| AI 建议添加路由守卫 beforeEach | ❌ 拒绝，过度设计，教学项目直接在各页面判断即可 |
| AI 建议密码加密后再存储 | ❌ 拒绝，Mock 项目不需要，明文便于调试和演示 |
| AI 生成 JWT token 生成和验证逻辑 | ❌ 删除，超出 Day6 范围 |
| AI 建议在 userStore 中存储 token 而非用户对象 | ❌ 拒绝，本项目不需要 token 机制 |
| ProfileView 和 UserCenterView 的 MOCK_USERS 硬编码切换 | ❌ 删除，改为真实登录后的退出按钮 |

## 8. 功能边界说明

本项目注册/登录功能基于 JSON Server、Pinia 和 localStorage 实现，**仅用于前端实训和状态管理模拟，不是生产环境安全认证系统。**

本项目暂未实现：
- 密码加密（密码以明文存储在 db.json 中）
- JWT Token
- 后端 Session
- 短信验证码 / 邮箱验证
- 第三方登录
- 找回密码
- 权限路由（访问控制仅在页面组件中做简单判断）
- 服务端安全校验（JSON Server 无后端逻辑）
- 用户头像真实上传

## 9. 完整功能走查记录

**准备工作：** 终端 1 `npm run mock`，终端 2 `npm run dev`

1. 打开 http://localhost:5173 → 首页正常显示
2. 导航栏显示"登录""注册"（未登录态）
3. 点击"注册" → /register → 填写表单（用户名 test001，密码 123456，显示名称 测试用户，学院 计算机学院，年级 2023级）
4. 点击"注册"按钮 → 提示"注册成功！请登录。" → 自动跳转 /login
5. 打开 db.json → users 数组末尾新增了 test001 用户（id:6）
6. 在登录页输入 test001 / 123456 → 点击"登录"
7. 登录成功 → 跳转首页 → 导航栏显示"测试用户"和"退出"
8. 刷新页面（F5）→ 导航栏仍显示"测试用户"（localStorage 恢复成功）
9. 进入发布页 → 选择二手交易 → 填写信息 → 点击发布
10. 发布成功 → 跳转到 /trade → 列表中可见新发布的数据
11. 在二手交易页输入关键词搜索 → 列表正确过滤
12. 点击收藏按钮 → 按钮变为蓝底"已收藏"
13. 进入个人中心（/user）→ 显示用户资料卡片 + 已发布/已参与/收藏 Tab
14. 切换到"我的收藏"Tab → 可见刚收藏的条目
15. 点击导航栏"退出" → 导航栏恢复为"登录""注册"
16. 再次进入个人中心 → 显示"请先登录后查看个人中心" + "去登录"按钮
17. 停止 JSON Server → 刷新 /trade → 显示 ErrorState + 重试按钮
18. 恢复 JSON Server → 点击重试 → 列表恢复

**走查结果：** 18 步全部通过，注册登录闭环完整，页面联动正确，搜索/状态反馈正常。

## 10. 遇到的问题与解决方法

**问题 1：改造 userStore 后页面白屏**

现象：`npm run dev` 启动后浏览器一片空白，无任何渲染。

排查：打开浏览器 DevTools Console → 报错 `TypeError: Cannot read properties of null (reading 'id')`。改造 userStore 后 `currentUser` 默认为 `null`（只有登录后才赋值），但多处代码直接访问了 `currentUser.id` 而没有做空值保护。

定位到 4 处崩溃点：
- `AppLayout.vue:12` — `watch(() => userStore.currentUser.id, ...)`
- `UserCenterView.vue:80` — `const userId = userStore.currentUser.id`
- `UserCenterView.vue:134` — `watch(() => userStore.currentUser.id, ...)`
- `UserCenterView.vue:218` — 模板中 `userStore.currentUser.college`

解决：全部改为可选链 `?.` 访问，`userId` 增加 `?? 1` 默认值。TypeScript + Vite build 零错误通过。

**问题 2：ProfileView 模板标签不匹配导致 build 失败**

现象：删除 MOCK_USERS 下拉菜单并添加未登录/已登录模板分支后，`vite build` 报 `Invalid end tag`。

排查：原下拉菜单有多层嵌套 div（user-dropdown > user-menu > menu-item × 5），替换为单个 logout-btn 后，多余的 `</div>` 闭合标签未删除。

解决：逐行核对模板标签嵌套，删除多余的 `</div>` 和对应的 `</template>`。

**问题 3：UserCenterView 中 ref 导入未清理**

现象：删除 `showUserMenu` ref 后，`ref` 仍被 import。但 linter 未报错，因为 `batchMode` 等其他变量也使用了 `ref`。

解决：确认 `ref` 仍有使用后保留 import，无需修改。

## 11. 今日反思

通过补充注册/登录功能，我对"用户状态""状态持久化"和"前端 Mock 认证边界"有了更深入的理解。

在 Day5 中，用户状态是"写死"的——userStore 中硬编码了一个默认用户，所有页面都假设这个用户始终存在。这在前几天可以工作，但它不是真实的应用体验。Day6 将用户状态改为"注册登录驱动"后，项目才真正具备了"用户身份"这一概念——每个操作都与一个具体的、通过登录确定的用户关联。

**状态持久化**的必要性在刷新页面时体现得最明显。Pinia 的状态在内存中，F5 之后全部归零。如果不做 localStorage 持久化，用户每次刷新都需要重新登录——这在任何真实 Web 应用中都是不可接受的。localStorage 在这里扮演的角色很简单但很关键：它让"登录"这个动作在浏览器层面有了记忆。当然，localStorage 存储明文用户信息在安全上是有风险的——生产环境中应该只存 token 而非完整用户对象，但在这个教学项目中，简洁和可理解性优先于安全性。

**前端 Mock 认证边界**是我在本次开发中反复提醒自己的概念。AI 多次尝试生成 JWT token 验证、路由守卫、密码加密等"生产级"代码——这些代码在技术上是正确的，但在教学项目中反而是噪音。我删除了 AI 生成的 token 相关逻辑，保留了最简单直接的"GET /users → 前端匹配"方案。这个决定的理由是：Day6 的目标是让学生理解"用户从哪来、状态往哪存、退出怎么清"，而不是实现一个工业级认证系统。功能边界清晰，学生才能看清核心逻辑。

**交互优化**在 Day6 中与注册登录形成了互补。一个没有登录状态的页面，错误提示最多是"数据加载失败"；有了登录状态后，错误提示可以精确到"请先登录后再发布信息"。状态反馈从"系统出了什么问题"升级为"你应该做什么来解决问题"——这是用户体验的本质进步。

通过今天的工作，项目从"可以看数据的静态展示"升级为"可以注册登录、发布内容、收藏管理的动态应用"，具备了 Day7 最终展示的完整条件。**注册登录、状态持久化、交互优化**三者结合，让项目真正像一个可用的 Web 应用，而不是一个数据展示页面。
