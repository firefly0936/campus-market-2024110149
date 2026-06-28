<script setup lang="ts">
import { ref, computed } from 'vue'

// 四个业务分类（与首页一致）
const categories = [
  { key: 'secondHand', name: '二手交易', icon: '🛒' },
  { key: 'lostAndFound', name: '失物招领', icon: '🔍' },
  { key: 'groupBuy', name: '拼单搭子', icon: '🤝' },
  { key: 'errand', name: '跑腿委托', icon: '🏃' },
]

const activeTab = ref('all')
const searchQuery = ref('')

interface ListItem {
  id: number
  title: string
  category: string
  price: number
}

const items: ListItem[] = [
  { id: 1, title: '二手自行车 — 9成新', category: '二手交易', price: 200 },
  { id: 2, title: '图书馆拾到校园卡', category: '失物招领', price: 0 },
  { id: 3, title: '奶茶拼单 — 满减差2人', category: '拼单搭子', price: 15 },
  { id: 4, title: '代取快递 — 北门驿站', category: '跑腿委托', price: 5 },
  { id: 5, title: '机械键盘 Cherry 青轴', category: '二手交易', price: 350 },
  { id: 6, title: '找室友拼网费 — 半年', category: '拼单搭子', price: 120 },
]

const filteredItems = computed(() => {
  let result = items
  // 先按分类筛选
  if (activeTab.value !== 'all') {
    const cat = categories.find(c => c.key === activeTab.value)
    if (cat) result = result.filter(item => item.category === cat.name)
  }
  // 再按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }
  return result
})
</script>

<template>
  <section class="page-market">
    <h2>集市列表</h2>
    <p>浏览校园轻集市的四类业务场景。</p>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <span class="search-icon">🔎</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索物品名称或分类…"
        class="search-input"
      />
      <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
    </div>

    <!-- 四分类子导航 -->
    <nav class="sub-nav">
      <button
        :class="['sub-nav-btn', { active: activeTab === 'all' }]"
        @click="activeTab = 'all'"
      >
        全部
      </button>
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="['sub-nav-btn', { active: activeTab === cat.key }]"
        @click="activeTab = cat.key"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </nav>

    <!-- 列表区域 -->
    <div class="item-list">
      <RouterLink
        v-for="item in filteredItems"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="item-card"
      >
        <div class="item-header">
          <span class="item-category">{{ item.category }}</span>
          <span v-if="item.price > 0" class="item-price">¥{{ item.price }}</span>
          <span v-else class="item-price free">免费</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <span class="item-arrow">查看详情 →</span>
      </RouterLink>
      <p v-if="!filteredItems.length" class="empty-tip">暂无相关条目</p>
    </div>
  </section>
</template>

<style scoped>
.page-market {
  padding: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
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

.search-clear {
  border: none;
  background: none;
  color: #c0c4cc;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
  transition: all 0.2s;
}

.search-clear:hover {
  color: #909399;
  background: #f0f0f0;
}

.sub-nav {
  display: flex;
  gap: 8px;
  margin: 16px 0 20px;
  flex-wrap: wrap;
}

.sub-nav-btn {
  padding: 8px 18px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-nav-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.sub-nav-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: block;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-category {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #e6a23c;
}

.item-price.free {
  color: #67c23a;
}

.item-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.item-arrow {
  font-size: 13px;
  color: #409eff;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
}
</style>
