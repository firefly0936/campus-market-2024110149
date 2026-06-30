<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/counter'
import { useAsync } from '@/composables/useAsync'
import { getSecondHandList, type SecondHandItem } from '@/api/secondHand'
import { getLostFoundList, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuyList, type GroupBuyItem } from '@/api/groupBuy'
import { getErrandList, type ErrandItem } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'

const store = useAppStore()
const activeTab = ref<'published' | 'joined'>('published')

interface PostRecord {
  id: number
  title: string
  category: string
  date: string
  status: string
}

const publishedItems = ref<PostRecord[]>([])
const joinedItems = ref<PostRecord[]>([])

const { loading, error, execute } = useAsync(async () => {
  const userId = store.currentUser?.id ?? 1

  const [sh, lf, gb, er] = await Promise.all([
    getSecondHandList(),
    getLostFoundList(),
    getGroupBuyList(),
    getErrandList(),
  ])

  // 我发布的
  publishedItems.value = [
    ...sh.data
      .filter((i: SecondHandItem) => i.sellerId === userId)
      .map((i: SecondHandItem) => ({
        id: i.id,
        title: i.title,
        category: '二手交易',
        date: i.createdAt,
        status: i.status,
      })),
    ...lf.data
      .filter((i: LostFoundItem) => i.publisherId === userId)
      .map((i: LostFoundItem) => ({
        id: i.id,
        title: i.title,
        category: '失物招领',
        date: i.createdAt,
        status: i.status,
      })),
    ...gb.data
      .filter((i: GroupBuyItem) => i.creatorId === userId)
      .map((i: GroupBuyItem) => ({
        id: i.id,
        title: i.title,
        category: '拼单搭子',
        date: i.createdAt,
        status: i.status,
      })),
    ...er.data
      .filter((i: ErrandItem) => i.publisherId === userId)
      .map((i: ErrandItem) => ({
        id: i.id,
        title: i.title,
        category: '跑腿委托',
        date: i.createdAt,
        status: i.status,
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

const completedCount = computed(
  () =>
    publishedItems.value.filter((i) =>
      ['已售', '已解决', '已完成', '已成团'].includes(i.status)
    ).length
)

const displayItems = computed(() =>
  activeTab.value === 'published' ? publishedItems.value : joinedItems.value
)
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
        <div class="avatar">{{ store.currentUser?.nickname?.charAt(0) || '👤' }}</div>
        <div class="user-info">
          <h2 class="user-name">{{ store.currentUser?.nickname || '校园用户' }}</h2>
          <p class="user-detail" v-if="store.currentUser?.id">
            用户 ID: {{ store.currentUser.id }}
          </p>
        </div>
        <button class="edit-btn" @click="store.setUser({ id: 2, nickname: '计算机学院小明' })">
          切换用户
        </button>
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
          @click="activeTab = 'published'"
        >
          我发布的
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'joined' }]"
          @click="activeTab = 'joined'"
        >
          我参与的
        </button>
      </nav>

      <!-- 列表 -->
      <div v-if="displayItems.length > 0" class="item-list">
        <div v-for="item in displayItems" :key="item.id" class="item-card">
          <div class="item-main">
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-meta">
              <span class="item-category">{{ item.category }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
          </div>
          <span
            :class="['item-status', {
              active: item.status === '在售' || item.status === '进行中' || item.status === '待接单' || item.status === '已加入',
            }]"
          >
            {{ item.status }}
          </span>
        </div>
      </div>

      <EmptyState v-else :text="activeTab === 'published' ? '还没有发布任何信息' : '还没有参与任何活动'" />
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
  margin: 0;
  font-size: 13px;
  color: #909399;
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
</style>
