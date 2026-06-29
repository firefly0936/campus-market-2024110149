<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGroupBuyList, type GroupBuyItem } from '@/api/groupBuy'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<GroupBuyItem[]>([])
const searchQuery = ref('')
const activeTab = ref<'all' | 'active' | 'completed'>('all')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getGroupBuyList()
    items.value = res.data
  } finally {
    loading.value = false
  }
})

const filteredItems = computed(() => {
  let result = items.value
  if (activeTab.value === 'active')
    result = result.filter(i => i.currentCount < i.targetCount)
  if (activeTab.value === 'completed')
    result = result.filter(i => i.currentCount >= i.targetCount)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(q))
  }
  return result
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
    <div class="search-bar">
      <span class="search-icon">🔎</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索拼单活动…"
        class="search-input"
      />
    </div>

    <!-- 加载 -->
    <p v-if="loading" class="empty-tip">加载中…</p>

    <!-- 列表 -->
    <div v-else class="list">
      <div v-for="item in filteredItems" :key="item.id" class="gb-card">
        <h3 class="gb-title">{{ item.title }}</h3>
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
        v-if="!loading && filteredItems.length === 0"
        text="暂无拼单活动"
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
  margin: 0 0 6px;
  font-size: 16px;
  color: #303133;
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
