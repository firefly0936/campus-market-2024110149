<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLostFoundList, type LostFoundItem } from '@/api/lostFound'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useCartStore } from '@/stores/cart'

const items = ref<LostFoundItem[]>([])
const keyword = ref('')
const activeTab = ref<'all' | 'lost' | 'found'>('all')
const loading = ref(false)
const error = ref(false)

const favStore = useFavoriteStore()
const cartStore = useCartStore()

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    const res = await getLostFoundList()
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
    if (item.status === '已解决') return false
    const matchTab =
      activeTab.value === 'all' ||
      (activeTab.value === 'lost' && item.type === '失物') ||
      (activeTab.value === 'found' && item.type === '招领')
    const matchKeyword =
      !keyword.value ||
      item.title.includes(keyword.value) ||
      item.location.includes(keyword.value) ||
      item.description.includes(keyword.value)
    return matchTab && matchKeyword
  })
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>🔍 失物招领</h1>
      <p>丢了东西？来这里找找。捡到东西？帮它找到主人。</p>
    </div>

    <!-- 类型筛选 -->
    <nav class="tab-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'all' }]"
        @click="activeTab = 'all'"
      >
        全部
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'lost' }]"
        @click="activeTab = 'lost'"
      >
        🔴 失物
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'found' }]"
        @click="activeTab = 'found'"
      >
        🟢 招领
      </button>
    </nav>

    <!-- 搜索 -->
    <SearchBar v-model="keyword" placeholder="搜索物品名称、地点或描述…" />

    <!-- 加载状态 -->
    <LoadingState v-if="loading" text="正在加载失物招领信息…" />

    <!-- 错误状态 -->
    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="fetchData"
    />

    <!-- 列表 -->
    <div v-else class="list">
      <div v-for="item in filteredItems" :key="item.id" class="lf-card">
        <div class="lf-header">
          <span :class="['type-badge', item.type === '失物' ? 'lost' : 'found']">
            {{ item.type }}
          </span>
          <span :class="['status-badge', item.status !== '未解决' ? 'resolved' : '']">
            {{ item.status }}
          </span>
          <div class="header-actions">
            <button
              class="favorite-btn"
              :class="{ active: favStore.isFavorited('lostAndFound', item.id) }"
              @click.stop="favStore.toggleFavorite('lostAndFound', item.id, item.title)"
            >
              {{ favStore.isFavorited('lostAndFound', item.id) ? '已收藏' : '收藏' }}
            </button>
            <button
              :class="['cart-mini', { active: cartStore.isInCart('lostAndFound', item.id) }]"
              @click.stop="cartStore.toggleCart({ type: 'lostAndFound', itemId: item.id, title: item.title, location: item.location })"
              :title="cartStore.isInCart('lostAndFound', item.id) ? '移出购物车' : '加入购物车'"
            >
              {{ cartStore.isInCart('lostAndFound', item.id) ? '🛒✓' : '🛒' }}
            </button>
          </div>
        </div>
        <h3 class="lf-title">{{ item.title }}</h3>
        <p class="lf-desc">{{ item.description }}</p>
        <div class="lf-meta">
          <span>📍 {{ item.location }}</span>
          <span>📅 {{ item.lostDate }}</span>
        </div>
      </div>
      <EmptyState
        v-if="filteredItems.length === 0"
        :text="keyword || activeTab !== 'all' ? '没有匹配的信息，试试调整筛选条件' : '暂无失物招领信息'"
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

.lf-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.lf-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.lf-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.header-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
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

.type-badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 600;
}

.type-badge.lost {
  background: #fef0f0;
  color: #f56c6c;
}

.type-badge.found {
  background: #f0f9eb;
  color: #67c23a;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #fdf6ec;
  color: #e6a23c;
}

.status-badge.resolved {
  background: #f0f9eb;
  color: #67c23a;
}

.lf-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.lf-desc {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lf-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
