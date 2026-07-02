<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGroupBuyList, type GroupBuyItem } from '@/api/groupBuy'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useCartStore } from '@/stores/cart'

const items = ref<GroupBuyItem[]>([])
const keyword = ref('')
const activeTab = ref<'all' | 'active' | 'completed'>('all')
const loading = ref(false)
const error = ref(false)

const favStore = useFavoriteStore()
const cartStore = useCartStore()

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    const res = await getGroupBuyList()
    items.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchTab =
      activeTab.value === 'all' ||
      (activeTab.value === 'active' && item.currentCount < item.targetCount) ||
      (activeTab.value === 'completed' && item.currentCount >= item.targetCount)
    const matchKeyword =
      !keyword.value ||
      item.title.includes(keyword.value) ||
      item.groupType.includes(keyword.value) ||
      item.meetingLocation.includes(keyword.value) ||
      item.description.includes(keyword.value)
    return matchTab && matchKeyword
  })
})

function progressPercent(item: GroupBuyItem): number {
  return Math.round((item.currentCount / item.targetCount) * 100)
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>🤝 拼单搭子</h1>
      <p>一起拼，更划算！找搭子凑单，享团购优惠。</p>
    </div>

    <!-- 状态筛选 -->
    <nav class="tab-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'all' }]"
        @click="activeTab = 'all'"
      >
        全部
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'active' }]"
        @click="activeTab = 'active'"
      >
        拼单中
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'completed' }]"
        @click="activeTab = 'completed'"
      >
        已成团
      </button>
    </nav>

    <!-- 搜索 -->
    <SearchBar v-model="keyword" placeholder="搜索标题、类型、地点或描述…" />

    <!-- 加载状态 -->
    <LoadingState v-if="loading" text="正在加载拼单活动…" />

    <!-- 错误状态 -->
    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="fetchData"
    />

    <!-- 列表 -->
    <div v-else class="list">
      <div v-for="item in filteredItems" :key="item.id" class="gb-card">
        <div class="gb-header">
          <h3 class="gb-title">{{ item.title }}</h3>
          <div class="gb-actions">
            <button
              class="favorite-btn"
              :class="{ active: favStore.isFavorited('groupBuy', item.id) }"
              @click.stop="favStore.toggleFavorite('groupBuy', item.id, item.title)"
            >
              {{ favStore.isFavorited('groupBuy', item.id) ? '已收藏' : '收藏' }}
            </button>
            <button
              :class="['cart-mini', { active: cartStore.isInCart('groupBuy', item.id) }]"
              @click.stop="cartStore.toggleCart({ type: 'groupBuy', itemId: item.id, title: item.title, location: item.meetingLocation })"
              :title="cartStore.isInCart('groupBuy', item.id) ? '移出购物车' : '加入购物车'"
            >
              {{ cartStore.isInCart('groupBuy', item.id) ? '🛒✓' : '🛒' }}
            </button>
          </div>
        </div>
        <p class="gb-desc">{{ item.description }}</p>
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercent(item) + '%' }"
              :class="{ done: item.currentCount >= item.targetCount }"
            ></div>
          </div>
          <span class="progress-text">{{ item.currentCount }}/{{ item.targetCount }} 人</span>
        </div>
        <div class="gb-meta">
          <span class="meta-tag">📅 {{ item.deadline }}</span>
          <span class="meta-tag">📍 {{ item.meetingLocation }}</span>
        </div>
        <div v-if="item.currentCount >= item.targetCount" class="gb-status">✅ 已成团</div>
      </div>
      <EmptyState
        v-if="filteredItems.length === 0"
        :text="keyword || activeTab !== 'all' ? '没有匹配的拼单，试试调整筛选条件' : '暂无拼单活动'"
      />
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.tab-nav {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 8px 20px;
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

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.gb-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.gb-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.gb-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  flex: 1;
}

.gb-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.gb-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
}

.favorite-btn,
.cart-mini {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.favorite-btn {
  font-size: 13px;
  padding: 4px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  background: #fff;
  transition: all 0.2s;
}

.favorite-btn:hover {
  border-color: #f56c6c;
  color: #f56c6c;
}

.favorite-btn.active {
  background: #dbeafe;
  color: #2563eb;
  border-color: #2563eb;
}

.cart-mini:hover {
  transform: scale(1.15);
}

.gb-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #409eff;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.progress-fill.done {
  background: #67c23a;
}

.progress-text {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.gb-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.gb-status {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
