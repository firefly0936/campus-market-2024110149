<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const sortBy = ref<'newest' | 'price-asc' | 'price-desc'>('newest')

interface TradeItem {
  id: number
  title: string
  price: number
  condition: string
  location: string
  image?: string
}

const items: TradeItem[] = [
  { id: 1, title: '二手自行车 — 9成新，骑了不到半年', price: 200, condition: '九成新', location: '北门车棚' },
  { id: 2, title: '机械键盘 Cherry 青轴 87键', price: 350, condition: '八成新', location: '2号宿舍楼' },
  { id: 3, title: '高等数学（第七版）上下册', price: 25, condition: '七成新', location: '图书馆' },
  { id: 4, title: '台灯 LED 护眼 三档调光', price: 45, condition: '九成新', location: '5号教学楼' },
  { id: 5, title: '二手吉他 民谣 41寸 送琴包', price: 280, condition: '八成新', location: '活动中心' },
  { id: 6, title: '床上小桌板 折叠款', price: 15, condition: '九成新', location: '1号宿舍楼' },
]

const filteredItems = computed(() => {
  let result = items
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(q))
  }
  if (sortBy.value === 'price-asc') result = [...result].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
  return result
})
</script>

<template>
  <section class="page-trade">
    <div class="page-header">
      <h2>🛒 二手交易</h2>
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

    <!-- 物品列表 -->
    <div class="trade-list">
      <div v-for="item in filteredItems" :key="item.id" class="trade-card">
        <div class="card-main">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span class="tag condition">{{ item.condition }}</span>
            <span class="tag location">📍 {{ item.location }}</span>
          </div>
        </div>
        <div class="card-price">
          <span v-if="item.price === 0" class="price free">免费</span>
          <span v-else class="price">¥{{ item.price }}</span>
          <span class="detail-link">查看详情 →</span>
        </div>
      </div>
      <p v-if="!filteredItems.length" class="empty-tip">暂无相关二手物品</p>
    </div>
  </section>
</template>

<style scoped>
.page-trade {
  padding: 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-header h2 {
  color: #333;
  font-size: 22px;
  margin: 0 0 8px;
}

.page-header p {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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

.trade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trade-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
}

.trade-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}

.card-main {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0 0 8px;
  font-size: 15px;
  color: #303133;
}

.card-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.tag.condition {
  background: #f0f2f5;
  color: #909399;
}

.tag.location {
  background: #ecf5ff;
  color: #409eff;
}

.card-price {
  text-align: right;
  flex-shrink: 0;
  margin-left: 16px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #e6a23c;
  display: block;
}

.price.free {
  color: #67c23a;
}

.detail-link {
  font-size: 12px;
  color: #409eff;
  margin-top: 4px;
  display: block;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
}
</style>
