<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLostFoundList, type LostFoundItem } from '@/api/lostFound'
import EmptyState from '@/components/EmptyState.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useCartStore } from '@/stores/cart'

const items = ref<LostFoundItem[]>([])
const searchQuery = ref('')
const activeTab = ref<'all' | 'lost' | 'found'>('all')
const loading = ref(false)

const favStore = useFavoriteStore()
const cartStore = useCartStore()

onMounted(async () => {
  loading.value = true
  try {
    const res = await getLostFoundList()
    items.value = res.data
  } finally {
    loading.value = false
  }
})

const filteredItems = computed(() => {
  let result = items.value.filter(item => item.status !== '已解决')
  if (activeTab.value === 'lost')
    result = result.filter(item => item.type === '失物')
  if (activeTab.value === 'found')
    result = result.filter(item => item.type === '招领')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    )
  }
  return result
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
    <div class="search-bar">
      <span class="search-icon">🔎</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索物品名称或地点…"
        class="search-input"
      />
    </div>

    <!-- 加载 -->
    <p v-if="loading" class="empty-tip">加载中…</p>

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
              :class="['fav-mini', { active: favStore.isFavorited('lostAndFound', item.id) }]"
              @click.stop="favStore.toggleFavorite('lostAndFound', item.id, item.title)"
              :title="favStore.isFavorited('lostAndFound', item.id) ? '取消收藏' : '添加收藏'"
            >
              {{ favStore.isFavorited('lostAndFound', item.id) ? '❤️' : '🤍' }}
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
        v-if="!loading && filteredItems.length === 0"
        text="暂无失物招领信息"
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  transition: border-color 0.2s;
}

.search-bar:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}

.search-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #303133;
  background: transparent;
}

.search-input::placeholder {
  color: #c0c4cc;
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

.fav-mini,
.cart-mini {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: transform 0.2s;
}
.fav-mini:hover,
.cart-mini:hover {
  transform: scale(1.15);
}
.fav-mini.active,
.cart-mini.active {
  transform: scale(1.1);
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

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: 1fr;
  }
}
</style>
