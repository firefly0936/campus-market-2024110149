<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getErrandList, type ErrandItem } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useCartStore } from '@/stores/cart'

const items = ref<ErrandItem[]>([])
const keyword = ref('')
const activeTab = ref<'all' | 'pending' | 'taken'>('all')
const loading = ref(false)
const error = ref(false)

const favStore = useFavoriteStore()
const cartStore = useCartStore()

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    const res = await getErrandList()
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
    if (item.status === '已完成') return false
    const matchTab =
      activeTab.value === 'all' ||
      (activeTab.value === 'pending' && item.status === '待接单') ||
      (activeTab.value === 'taken' && item.status !== '待接单')
    const matchKeyword =
      !keyword.value ||
      item.title.includes(keyword.value) ||
      item.taskType.includes(keyword.value) ||
      item.pickupLocation.includes(keyword.value) ||
      item.deliveryLocation.includes(keyword.value)
    return matchTab && matchKeyword
  })
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>🏃 跑腿委托</h1>
      <p>找人帮忙，省时省力。发布或接单校园跑腿任务。</p>
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
        :class="['tab-btn', { active: activeTab === 'pending' }]"
        @click="activeTab = 'pending'"
      >
        待接单
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'taken' }]"
        @click="activeTab = 'taken'"
      >
        已接单
      </button>
    </nav>

    <!-- 搜索 -->
    <SearchBar v-model="keyword" placeholder="搜索标题、任务类型、取件或送达地点…" />

    <!-- 加载状态 -->
    <LoadingState v-if="loading" text="正在加载跑腿任务…" />

    <!-- 错误状态 -->
    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="fetchData"
    />

    <!-- 列表 -->
    <div v-else class="list">
      <div v-for="item in filteredItems" :key="item.id" class="errand-card">
        <div class="errand-header">
          <h3 class="errand-title">{{ item.title }}</h3>
          <div class="errand-actions">
            <button
              class="favorite-btn"
              :class="{ active: favStore.isFavorited('errand', item.id) }"
              @click.stop="favStore.toggleFavorite('errand', item.id, item.title)"
            >
              {{ favStore.isFavorited('errand', item.id) ? '已收藏' : '收藏' }}
            </button>
            <button
              :class="['cart-mini', { active: cartStore.isInCart('errand', item.id) }]"
              @click.stop="cartStore.toggleCart({ type: 'errand', itemId: item.id, title: item.title, price: item.reward, location: item.pickupLocation })"
              :title="cartStore.isInCart('errand', item.id) ? '移出购物车' : '加入购物车'"
            >
              {{ cartStore.isInCart('errand', item.id) ? '🛒✓' : '🛒' }}
            </button>
          </div>
          <span :class="['status-tag', item.status === '待接单' ? 'pending' : 'taken']">
            {{ item.status }}
          </span>
        </div>
        <p class="errand-desc">{{ item.description }}</p>
        <div class="route-line">
          <span class="route-point pickup">📦 {{ item.pickupLocation }}</span>
          <span class="route-arrow">→</span>
          <span class="route-point delivery">📍 {{ item.deliveryLocation }}</span>
        </div>
        <div class="errand-footer">
          <span class="reward" v-if="item.reward > 0">💰 报酬 ¥{{ item.reward }}</span>
          <span class="reward free" v-else>🤝 免费帮忙</span>
          <span class="deadline">⏰ {{ item.expectedTime }}</span>
        </div>
      </div>
      <EmptyState
        v-if="filteredItems.length === 0"
        :text="keyword || activeTab !== 'all' ? '没有匹配的跑腿任务，试试调整筛选条件' : '暂无跑腿任务'"
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

.errand-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.errand-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.errand-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.errand-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  flex: 1;
}

.status-tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 600;
}

.errand-actions {
  display: flex;
  gap: 4px;
  align-items: center;
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

.status-tag.pending {
  background: #fdf6ec;
  color: #e6a23c;
}

.status-tag.taken {
  background: #ecf5ff;
  color: #409eff;
}

.errand-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.route-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.route-point {
  flex: 1;
}

.route-arrow {
  color: #c0c4cc;
  flex-shrink: 0;
}

.errand-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.reward {
  font-weight: 600;
  color: #e6a23c;
}

.reward.free {
  color: #67c23a;
}

.deadline {
  color: #999;
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
