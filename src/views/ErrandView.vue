<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getErrandList, type ErrandItem } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<ErrandItem[]>([])
const searchQuery = ref('')
const activeTab = ref<'all' | 'pending' | 'taken'>('all')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getErrandList()
    items.value = res.data
  } finally {
    loading.value = false
  }
})

const filteredItems = computed(() => {
  let result = items.value
  if (activeTab.value === 'pending')
    result = result.filter(i => i.status === '待接单')
  if (activeTab.value === 'taken')
    result = result.filter(i => i.status !== '待接单')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.pickupLocation.toLowerCase().includes(q) ||
        item.deliveryLocation.toLowerCase().includes(q)
    )
  }
  return result
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
    <div class="search-bar">
      <span class="search-icon">🔎</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索跑腿任务…"
        class="search-input"
      />
    </div>

    <!-- 加载 -->
    <p v-if="loading" class="empty-tip">加载中…</p>

    <!-- 列表 -->
    <div v-else class="list">
      <div v-for="item in filteredItems" :key="item.id" class="errand-card">
        <div class="errand-header">
          <h3 class="errand-title">{{ item.title }}</h3>
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
        v-if="!loading && filteredItems.length === 0"
        text="暂无跑腿任务"
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
