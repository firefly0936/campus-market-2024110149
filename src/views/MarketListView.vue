<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSecondHandList, type SecondHandItem } from '@/api/secondHand'
import { getLostFoundList, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuyList, type GroupBuyItem } from '@/api/groupBuy'
import { getErrandList, type ErrandItem } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'

// 统一列表项类型
interface MarketItem {
  id: number
  title: string
  category: string
  categoryKey: string
  price: number
  extra: string
}

const items = ref<MarketItem[]>([])
const loading = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')

const categories = [
  { key: 'secondHand', name: '二手交易', icon: '🛒' },
  { key: 'lostAndFound', name: '失物招领', icon: '🔍' },
  { key: 'groupBuy', name: '拼单搭子', icon: '🤝' },
  { key: 'errand', name: '跑腿委托', icon: '🏃' },
]

onMounted(async () => {
  loading.value = true
  try {
    const [secondHandRes, lostFoundRes, groupBuyRes, errandRes] = await Promise.all([
      getSecondHandList(),
      getLostFoundList(),
      getGroupBuyList(),
      getErrandList(),
    ])

    const secondHandItems: MarketItem[] = secondHandRes.data
      .filter((item: SecondHandItem) => item.status !== '已售')
      .map((item: SecondHandItem) => ({
        id: item.id, title: item.title,
        category: '二手交易', categoryKey: 'secondHand',
        price: item.price, extra: item.condition,
      }))

    const lostFoundItems: MarketItem[] = lostFoundRes.data
      .filter((item: LostFoundItem) => item.status !== '已解决')
      .map((item: LostFoundItem) => ({
        id: item.id, title: item.title,
        category: '失物招领', categoryKey: 'lostAndFound',
        price: 0, extra: item.type,
      }))

    const groupBuyItems: MarketItem[] = groupBuyRes.data
      .filter((item: GroupBuyItem) => item.status !== '已成团')
      .map((item: GroupBuyItem) => ({
        id: item.id, title: item.title,
        category: '拼单搭子', categoryKey: 'groupBuy',
        price: 0, extra: `${item.currentCount}/${item.targetCount}人`,
      }))

    const errandItems: MarketItem[] = errandRes.data
      .filter((item: ErrandItem) => item.status !== '已完成')
      .map((item: ErrandItem) => ({
        id: item.id, title: item.title,
        category: '跑腿委托', categoryKey: 'errand',
        price: item.reward, extra: item.status,
      }))

    items.value = [...secondHandItems, ...lostFoundItems, ...groupBuyItems, ...errandItems]
  } finally {
    loading.value = false
  }
})

const filteredItems = computed(() => {
  let result = items.value
  if (activeTab.value !== 'all') {
    result = result.filter(item => item.categoryKey === activeTab.value)
  }
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

    <!-- 加载 -->
    <p v-if="loading" class="empty-tip">加载中…</p>

    <!-- 列表区域 -->
    <div v-else class="item-list">
      <RouterLink
        v-for="item in filteredItems"
        :key="`${item.categoryKey}-${item.id}`"
        :to="`/detail/${item.categoryKey}/${item.id}`"
        class="item-card"
      >
        <div class="item-header">
          <span class="item-category">{{ item.category }}</span>
          <span v-if="item.price > 0" class="item-price">¥{{ item.price }}</span>
          <span v-else class="item-price free">{{ item.extra }}</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <span class="item-arrow">查看详情 →</span>
      </RouterLink>
      <EmptyState
        v-if="!loading && filteredItems.length === 0"
        text="暂无相关条目"
      />
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
