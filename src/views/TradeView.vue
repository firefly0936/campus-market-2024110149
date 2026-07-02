<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSecondHandList, type SecondHandItem } from '@/api/secondHand'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useCartStore } from '@/stores/cart'

const items = ref<SecondHandItem[]>([])
const keyword = ref('')
const categoryFilter = ref('')
const sortBy = ref<'newest' | 'price-asc' | 'price-desc'>('newest')
const loading = ref(false)
const error = ref(false)

const categories = computed(() => {
  const cats = new Set(items.value.map(item => item.category).filter(Boolean))
  return Array.from(cats).sort()
})

const favStore = useFavoriteStore()
const cartStore = useCartStore()

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    const res = await getSecondHandList()
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
  let result = items.value
  // 隐藏已完成的
  result = result.filter(item => item.status !== '已售')
  if (categoryFilter.value) {
    result = result.filter(item => item.category === categoryFilter.value)
  }
  if (keyword.value.trim()) {
    const q = keyword.value.trim().toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tradeLocation.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }
  if (sortBy.value === 'price-asc')
    result = [...result].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc')
    result = [...result].sort((a, b) => b.price - a.price)
  return result
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>🛒 二手交易</h1>
      <p>闲置物品买卖，物尽其用，让旧物找到新主人。</p>
    </div>

    <!-- 搜索与排序 -->
    <div class="toolbar">
      <SearchBar v-model="keyword" placeholder="搜索商品标题、分类、地点或描述" />
      <select v-model="categoryFilter" class="sort-select">
        <option value="">全部分类</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="sortBy" class="sort-select">
        <option value="newest">最新发布</option>
        <option value="price-asc">价格从低到高</option>
        <option value="price-desc">价格从高到低</option>
      </select>
    </div>

    <!-- 加载状态 -->
    <LoadingState v-if="loading" text="正在加载二手交易信息…" />

    <!-- 错误状态 -->
    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="fetchData"
    />

    <!-- 物品列表 -->
    <div v-else class="list">
      <div v-for="item in filteredItems" :key="item.id" class="trade-card">
        <div class="card-main">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span class="tag condition">{{ item.condition }}</span>
            <span class="tag location">📍 {{ item.tradeLocation }}</span>
          </div>
        </div>
        <p class="card-desc">{{ item.description }}</p>
        <div class="card-price">
          <div class="card-actions">
            <button
              class="favorite-btn"
              :class="{ active: favStore.isFavorited('secondHand', item.id) }"
              @click.stop="favStore.toggleFavorite('secondHand', item.id, item.title)"
            >
              {{ favStore.isFavorited('secondHand', item.id) ? '已收藏' : '收藏' }}
            </button>
            <button
              :class="['cart-mini', { active: cartStore.isInCart('secondHand', item.id) }]"
              @click.stop="cartStore.toggleCart({ type: 'secondHand', itemId: item.id, title: item.title, price: item.price, location: item.tradeLocation })"
              :title="cartStore.isInCart('secondHand', item.id) ? '移出购物车' : '加入购物车'"
            >
              {{ cartStore.isInCart('secondHand', item.id) ? '🛒✓' : '🛒' }}
            </button>
          </div>
          <span v-if="item.price === 0" class="price free">免费</span>
          <span v-else class="price">¥{{ item.price }}</span>
        </div>
      </div>
      <EmptyState
        v-if="filteredItems.length === 0"
        :text="keyword || categoryFilter ? '没有匹配的商品，试试调整筛选条件' : '暂无二手交易信息'"
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

.toolbar {
  display: flex;
  gap: 12px;
}

.sort-select {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.trade-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.trade-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}

.card-main {
  margin-bottom: 8px;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.card-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.condition {
  background: #f0f2f5;
  color: #6b7280;
}

.location {
  background: #ecf5ff;
  color: #409eff;
}

.card-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.favorite-btn,
.cart-mini {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
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

.price {
  font-size: 20px;
  font-weight: 700;
  color: #e6a23c;
}

.price.free {
  color: #67c23a;
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
