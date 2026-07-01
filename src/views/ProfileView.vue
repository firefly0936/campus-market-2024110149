<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { useAsync } from '@/composables/useAsync'
import { getSecondHandList, type SecondHandItem, updateSecondHand, deleteSecondHand } from '@/api/secondHand'
import { getLostFoundList, type LostFoundItem, updateLostFound, deleteLostFound } from '@/api/lostFound'
import { getGroupBuyList, type GroupBuyItem, updateGroupBuy, deleteGroupBuy } from '@/api/groupBuy'
import { getErrandList, type ErrandItem, updateErrand, deleteErrand } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'

const store = useUserStore()
const favStore = useFavoriteStore()
const activeTab = ref<'published' | 'joined' | 'favorites'>('published')

// ── 批量管理 ──
const batchMode = ref(false)
const selectedFavs = reactive<Set<string>>(new Set())

function favKey(type: string, itemId: number) {
  return `${type}-${itemId}`
}

function toggleSelect(type: string, itemId: number) {
  const key = favKey(type, itemId)
  if (selectedFavs.has(key)) {
    selectedFavs.delete(key)
  } else {
    selectedFavs.add(key)
  }
}

function toggleSelectAll() {
  if (selectedFavs.size === favStore.favorites.length) {
    selectedFavs.clear()
  } else {
    favStore.favorites.forEach((f) => selectedFavs.add(favKey(f.type, f.itemId)))
  }
}

function batchRemove() {
  const ids = Array.from(selectedFavs).map((key) => {
    const [type, itemId] = key.split('-')
    return { type: type as any, itemId: Number(itemId) }
  })
  ids.forEach(({ type, itemId }) => favStore.removeFavorite(type, itemId))
  selectedFavs.clear()
  batchMode.value = false
}

function exitBatch() {
  batchMode.value = false
  selectedFavs.clear()
}

const isAllSelected = computed(
  () => favStore.favorites.length > 0 && selectedFavs.size === favStore.favorites.length
)

// ── 用户切换（下拉） ──
const MOCK_USERS = [
  { id: 1, name: '校园用户', college: '计算机学院', grade: '2023 级' },
  { id: 2, name: '计算机学院小明', college: '计算机学院', grade: '2022 级' },
  { id: 3, name: '经管学院小红', college: '经管学院', grade: '2023 级' },
  { id: 4, name: '外语学院小刚', college: '外语学院', grade: '2024 级' },
  { id: 5, name: '电信学院小美', college: '电信学院', grade: '2023 级' },
]
const showUserMenu = ref(false)

function switchTo(user: typeof MOCK_USERS[number]) {
  store.updateProfile(user)
  showUserMenu.value = false
}

// ── 发布管理 ──
const DONE_STATUS: Record<PostSource, string> = {
  secondHand: '已售',
  lostAndFound: '已解决',
  groupBuy: '已成团',
  errand: '已完成',
}

async function deletePost(item: PostRecord) {
  if (!confirm(`确定要删除「${item.title}」吗？`)) return
  try {
    const apis = {
      secondHand: deleteSecondHand,
      lostAndFound: deleteLostFound,
      groupBuy: deleteGroupBuy,
      errand: deleteErrand,
    }
    await apis[item.source](item.id)
    publishedItems.value = publishedItems.value.filter((p) => !(p.source === item.source && p.id === item.id))
  } catch {
    alert('删除失败，请检查网络')
  }
}

async function markDone(item: PostRecord) {
  try {
    const apis = {
      secondHand: updateSecondHand,
      lostAndFound: updateLostFound,
      groupBuy: updateGroupBuy,
      errand: updateErrand,
    }
    await apis[item.source](item.id, { status: DONE_STATUS[item.source] } as any)
    item.status = DONE_STATUS[item.source]
  } catch {
    alert('操作失败，请检查网络')
  }
}

type PostSource = 'secondHand' | 'lostAndFound' | 'groupBuy' | 'errand'

interface PostRecord {
  id: number
  title: string
  category: string
  date: string
  status: string
  source: PostSource
}

const publishedItems = ref<PostRecord[]>([])
const joinedItems = ref<PostRecord[]>([])
// 全部原始数据，供收藏夹查询实时状态
const allItems = ref<Map<string, string>>(new Map()) // key: "type-id" → status

const { loading, error, execute } = useAsync(async () => {
  const userId = store.currentUser?.id ?? 1

  const [sh, lf, gb, er] = await Promise.all([
    getSecondHandList(),
    getLostFoundList(),
    getGroupBuyList(),
    getErrandList(),
  ])

  // 全部数据状态索引（供收藏夹查询）
  allItems.value.clear()
  sh.data.forEach((i: SecondHandItem) => allItems.value.set(`secondHand-${i.id}`, i.status))
  lf.data.forEach((i: LostFoundItem) => allItems.value.set(`lostAndFound-${i.id}`, i.status))
  gb.data.forEach((i: GroupBuyItem) => allItems.value.set(`groupBuy-${i.id}`, i.status))
  er.data.forEach((i: ErrandItem) => allItems.value.set(`errand-${i.id}`, i.status))

  // 我发布的
  publishedItems.value = [
    ...sh.data
      .filter((i: SecondHandItem) => i.sellerId === userId)
      .map((i: SecondHandItem) => ({
        id: i.id, title: i.title,
        category: '二手交易', date: i.createdAt, status: i.status,
        source: 'secondHand' as PostSource,
      })),
    ...lf.data
      .filter((i: LostFoundItem) => i.publisherId === userId)
      .map((i: LostFoundItem) => ({
        id: i.id, title: i.title,
        category: '失物招领', date: i.createdAt, status: i.status,
        source: 'lostAndFound' as PostSource,
      })),
    ...gb.data
      .filter((i: GroupBuyItem) => i.creatorId === userId)
      .map((i: GroupBuyItem) => ({
        id: i.id, title: i.title,
        category: '拼单搭子', date: i.createdAt, status: i.status,
        source: 'groupBuy' as PostSource,
      })),
    ...er.data
      .filter((i: ErrandItem) => i.publisherId === userId)
      .map((i: ErrandItem) => ({
        id: i.id, title: i.title,
        category: '跑腿委托', date: i.createdAt, status: i.status,
        source: 'errand' as PostSource,
      })),
  ]

  // 我参与的（拼单中 currentCount 包含了我）
  joinedItems.value = gb.data
    .filter((i: GroupBuyItem) => i.creatorId !== userId)
    .map((i: GroupBuyItem) => ({
      id: i.id,
      title: i.title,
      category: '拼单搭子',
      date: i.createdAt,
      status: '已加入',
    }))
})

onMounted(() => execute())

// 每次导航到此页面时重新获取数据
const route = useRoute()
watch(() => route.path, () => { if (route.path === '/user' || route.path === '/user-center') execute() })
// 切换用户后立即刷新
watch(() => store.currentUser.id, () => execute())

const completedCount = computed(
  () =>
    publishedItems.value.filter((i) =>
      ['已售', '已解决', '已完成', '已成团'].includes(i.status)
    ).length
)

const favRecords = computed(() =>
  favStore.favorites.map((f) => {
    const realStatus = allItems.value.get(`${f.type}-${f.itemId}`)
    return {
      id: f.itemId,
      title: f.title,
      category: { secondHand: '二手交易', lostAndFound: '失物招领', groupBuy: '拼单搭子', errand: '跑腿委托' }[f.type] || f.type,
      date: f.addedAt.slice(0, 10),
      status: realStatus || '已失效',
    }
  })
)

const displayItems = computed(() => {
  if (activeTab.value === 'published') return publishedItems.value
  if (activeTab.value === 'joined') return joinedItems.value
  return favRecords.value
})
</script>

<template>
  <section class="page-profile">
    <!-- loading -->
    <p v-if="loading" class="state-text">加载中…</p>

    <!-- error -->
    <div v-else-if="error" class="error-box">
      <p>⚠️ {{ error }}</p>
      <button class="retry-btn" @click="execute()">重试</button>
    </div>

    <!-- 正常 -->
    <template v-else>
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="avatar">{{ store.currentUser.name.charAt(0) }}</div>
        <div class="user-info">
          <h2 class="user-name">{{ store.displayName }}</h2>
          <p class="user-detail" v-if="store.currentUser?.college">
            🏫 {{ store.currentUser.college }}
          </p>
          <p class="user-detail" v-if="store.currentUser?.grade">
            🎓 {{ store.currentUser.grade }}
          </p>
          <p class="user-detail" v-if="store.currentUser?.id">
            ID: {{ store.currentUser.id }}
          </p>
        </div>
        <div class="user-actions">
          <div class="user-dropdown">
            <button class="edit-btn" @click="showUserMenu = !showUserMenu">
              {{ store.currentUser.name }} ▾
            </button>
            <Transition name="menu-fade">
              <div v-if="showUserMenu" class="user-menu" @mouseleave="showUserMenu = false">
                <div
                  v-for="u in MOCK_USERS"
                  :key="u.id"
                  :class="['user-menu-item', { current: u.id === store.currentUser.id }]"
                  @click="switchTo(u)"
                >
                  <span class="menu-avatar">{{ u.name.charAt(0) }}</span>
                  <span class="menu-info">
                    <strong>{{ u.name }}</strong>
                    <small>{{ u.college }} · {{ u.grade }}</small>
                  </span>
                  <span v-if="u.id === store.currentUser.id" class="menu-check">✓</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- 统计概览 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">{{ publishedItems.length }}</span>
          <span class="stat-label">已发布</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ joinedItems.length }}</span>
          <span class="stat-label">已参与</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ completedCount }}</span>
          <span class="stat-label">已完成</span>
        </div>
      </div>

      <!-- Tab 切换 -->
      <nav class="tab-nav">
        <button
          :class="['tab-btn', { active: activeTab === 'published' }]"
          @click="activeTab = 'published'; exitBatch()"
        >
          我发布的
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'joined' }]"
          @click="activeTab = 'joined'; exitBatch()"
        >
          我参与的
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'favorites' }]"
          @click="activeTab = 'favorites'"
        >
          ❤️ 我的收藏 ({{ favStore.count }})
        </button>
      </nav>

      <!-- 列表 — 我发布的（可管理） -->
      <div v-if="activeTab === 'published' && publishedItems.length > 0" class="item-list">
        <div v-for="item in publishedItems" :key="item.source + '-' + item.id" class="item-card">
          <div class="item-main">
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-meta">
              <span class="item-category">{{ item.category }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
          </div>
          <div class="item-actions">
            <button
              v-if="!['已售','已解决','已成团','已完成'].includes(item.status)"
              class="action-btn done-btn"
              @click="markDone(item)"
              title="标记完成"
            >
              ✓
            </button>
            <button class="action-btn del-btn" @click="deletePost(item)" title="删除">
              🗑
            </button>
          </div>
        </div>
      </div>

      <!-- 列表 — 我参与的（只读） -->
      <div v-if="activeTab === 'joined' && joinedItems.length > 0" class="item-list">
        <div v-for="item in joinedItems" :key="item.id" class="item-card">
          <div class="item-main">
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-meta">
              <span class="item-category">{{ item.category }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
          </div>
          <span class="item-status active">{{ item.status }}</span>
        </div>
      </div>

      <!-- 列表 — 收藏（可管理+批量） -->
      <div v-if="activeTab === 'favorites' && favStore.count > 0">
        <!-- 批量操作栏 -->
        <div class="batch-bar">
          <button
            v-if="!batchMode"
            class="batch-toggle-btn"
            @click="batchMode = true"
          >
            ☐ 多选
          </button>
          <template v-else>
            <label class="batch-check">
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
              <span>全选</span>
            </label>
            <div class="batch-actions">
              <button
                v-if="selectedFavs.size > 0"
                class="batch-remove-btn"
                @click="batchRemove"
              >
                取消收藏 ({{ selectedFavs.size }})
              </button>
              <button class="batch-cancel-btn" @click="exitBatch">完成</button>
            </div>
          </template>
        </div>

        <div class="item-list">
          <div v-for="fav in favStore.favorites" :key="fav.type + '-' + fav.itemId" class="item-card">
            <input
              v-if="batchMode"
              type="checkbox"
              class="item-check"
              :checked="selectedFavs.has(favKey(fav.type, fav.itemId))"
              @change="toggleSelect(fav.type, fav.itemId)"
            />
            <div class="item-main">
              <h3 class="item-title">{{ fav.title }}</h3>
              <div class="item-meta">
                <span class="item-category">{{ { secondHand: '二手交易', lostAndFound: '失物招领', groupBuy: '拼单搭子', errand: '跑腿委托' }[fav.type] }}</span>
                <span class="item-date">{{ fav.addedAt.slice(0, 10) }}</span>
              </div>
            </div>
            <span
              :class="['item-status', { active: !['已售','已解决','已成团','已完成','已失效'].includes(allItems.get(fav.type + '-' + fav.itemId) || '') }]"
            >
              {{ allItems.get(fav.type + '-' + fav.itemId) || '已失效' }}
            </span>
            <button class="remove-btn" @click="favStore.removeFavorite(fav.type, fav.itemId)">
              取消收藏
            </button>
          </div>
        </div>
      </div>

      <EmptyState
        v-else
        :text="
          activeTab === 'published'
            ? '还没有发布任何信息'
            : activeTab === 'joined'
              ? '还没有参与任何活动'
              : '还没有收藏任何内容'
        "
      />
    </template>
  </section>
</template>

<style scoped>
.page-profile {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.state-text {
  text-align: center;
  color: #999;
  padding: 32px 0;
}
.error-box {
  text-align: center;
  padding: 32px;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
}
.error-box p {
  color: #dc2626;
  margin-bottom: 12px;
}
.retry-btn {
  padding: 8px 24px;
  border: 1px solid #409eff;
  background: #fff;
  color: #409eff;
  border-radius: 6px;
  cursor: pointer;
}
.retry-btn:hover {
  background: #409eff;
  color: #fff;
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #ecf5ff, #f0f7ff);
  border-radius: 12px;
  border: 1px solid #c6e2ff;
  margin-bottom: 20px;
}
.avatar {
  width: 64px;
  height: 64px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
  border: 2px solid #409eff;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  margin: 0 0 6px;
  font-size: 20px;
  color: #303133;
}
.user-detail {
  margin: 0 0 3px;
  font-size: 13px;
  color: #909399;
}
.user-actions {
  flex-shrink: 0;
}
.edit-btn {
  padding: 6px 16px;
  border: 1px solid #409eff;
  border-radius: 6px;
  background: #fff;
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.edit-btn:hover {
  background: #409eff;
  color: #fff;
}

/* ── 用户下拉 ── */
.user-dropdown {
  position: relative;
}
.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
}
.user-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.user-menu-item:hover {
  background: #f5f7fa;
}
.user-menu-item.current {
  background: #ecf5ff;
}
.menu-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.menu-info {
  flex: 1;
  min-width: 0;
}
.menu-info strong {
  display: block;
  font-size: 14px;
  color: #303133;
}
.menu-info small {
  font-size: 12px;
  color: #909399;
}
.menu-check {
  color: #409eff;
  font-weight: 700;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 统计 */
.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.stat-item {
  flex: 1;
  text-align: center;
  padding: 14px 8px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}
.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 4px;
}
.stat-label {
  font-size: 12px;
  color: #999;
}

/* Tab */
.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tab-btn {
  padding: 8px 24px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.tab-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

/* 列表 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  background: #fff;
}
.item-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.item-main {
  flex: 1;
  min-width: 0;
}
.item-title {
  margin: 0 0 6px;
  font-size: 15px;
  color: #303133;
}
.item-meta {
  display: flex;
  gap: 10px;
}
.item-category {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 1px 8px;
  border-radius: 4px;
}
.item-date {
  font-size: 12px;
  color: #c0c4cc;
}
.item-status {
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  flex-shrink: 0;
  margin-left: 12px;
}
.item-status.active {
  color: #67c23a;
}

/* ── 发布管理按钮 ── */
.item-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  margin-left: 12px;
}
.action-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}
.action-btn:hover {
  transform: scale(1.1);
}
.done-btn {
  color: #67c23a;
  border-color: #c8e6c9;
}
.done-btn:hover {
  background: #f0f9eb;
}
.del-btn {
  color: #f56c6c;
  border-color: #fecaca;
}
.del-btn:hover {
  background: #fef0f0;
}

/* ── 批量管理 ── */
.batch-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  margin-bottom: 8px;
}
.batch-toggle-btn {
  padding: 6px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.batch-toggle-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.batch-actions {
  display: flex;
  gap: 8px;
}
.batch-cancel-btn {
  padding: 6px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
}
.batch-cancel-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.batch-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
}
.batch-remove-btn {
  padding: 6px 14px;
  border: 1px solid #f56c6c;
  border-radius: 6px;
  background: #fff;
  color: #f56c6c;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.batch-remove-btn:hover {
  background: #fef0f0;
}

.item-check {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #409eff;
  flex-shrink: 0;
}

/* ── 取消收藏 ── */
.remove-btn {
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  flex-shrink: 0;
  margin-left: 12px;
  transition: all 0.2s;
}
.remove-btn:hover {
  background: #fef0f0;
  color: #f56c6c;
}
</style>
