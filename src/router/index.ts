import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── 首页 ──
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '校园轻集市' },
    },
    {
      path: '/home',
      redirect: '/',
    },

    // ── 四大业务场景 ──
    {
      path: '/trade',
      name: 'trade',
      component: () => import('@/views/TradeView.vue'),
      meta: { title: '二手交易' },
    },
    {
      path: '/lost-found',
      name: 'lost-found',
      component: () => import('@/views/LostFoundView.vue'),
      meta: { title: '失物招领' },
    },
    {
      path: '/group-buy',
      name: 'group-buy',
      component: () => import('@/views/GroupBuyView.vue'),
      meta: { title: '拼单搭子' },
    },
    {
      path: '/errand',
      name: 'errand',
      component: () => import('@/views/ErrandView.vue'),
      meta: { title: '跑腿委托' },
    },

    // ── 集市列表 & 详情 ──
    {
      path: '/market',
      name: 'market',
      component: () => import('@/views/MarketListView.vue'),
      meta: { title: '集市列表' },
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/DetailView.vue'),
      meta: { title: '物品详情' },
    },

    // ── 发布 ──
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/PublishView.vue'),
      meta: { title: '发布信息' },
    },

    // ── 消息 ──
    {
      path: '/message',
      name: 'message',
      component: () => import('@/views/MessageView.vue'),
      meta: { title: '消息' },
    },

    // ── 个人中心 ──
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: '个人中心' },
    },
    {
      path: '/user-center',
      name: 'user-center',
      component: () => import('@/views/UserCenterView.vue'),
      meta: { title: '用户中心' },
    },

    // ── 看板 ──
    {
      path: '/board',
      name: 'board',
      component: () => import('@/views/BoardView.vue'),
      meta: { title: '数据看板' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: '趋势看板' },
    },
  ],
})

// 动态设置页面标题
const BASE_TITLE = '校园轻集市'

router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle ? `${pageTitle} — ${BASE_TITLE}` : BASE_TITLE
})

export default router
