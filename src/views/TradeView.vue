<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSecondHandList, type SecondHandItem } from '@/api/secondHand'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<SecondHandItem[]>([])
const searchQuery = ref('')
const sortBy = ref<'newest' | 'price-asc' | 'price-desc'>('newest')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getSecondHandList()
    items.value = res.data
  } finally {
    loading.value = false
  }
})

const filteredItems = computed(() => {
  let result = items.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
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
      <div class="search-bar">
        <span class="search-icon">🔎</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索二手物品…"
          class="search-input"
        />
      </div>
      <select v-model="sortBy" class="sort-select">
        <option value="newest">最新发布</option>
        <option value="price-asc">价格从低到高</option>
        <option value="price-desc">价格从高到低</option>
      </select>
    </div>

    <!-- 加载状态 -->
    <p v-if="loading" class="empty-tip">加载中…</p>

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
          <span v-if="item.price === 0" class="price free">免费</span>
          <span v-else class="price">¥{{ item.price }}</span>
        </div>
      </div>
      <EmptyState
        v-if="!loading && filteredItems.length === 0"
        text="暂无二手交易信息"
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

.search-bar {
  flex: 1;
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
  justify-content: flex-end;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #e6a23c;
}

.price.free {
  color: #67c23a;
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
