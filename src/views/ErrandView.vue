<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'all' | 'pending' | 'taken'>('all')
const searchQuery = ref('')

interface ErrandItem {
  id: number
  title: string
  reward: number
  pickup: string
  delivery: string
  deadline: string
  status: string
}

const items: ErrandItem[] = [
  { id: 1, title: '代取快递 — 北门驿站 中通2件', reward: 5, pickup: '北门驿站', delivery: '3号宿舍楼', deadline: '2026-06-28 18:00', status: '待接单' },
  { id: 2, title: '代买早餐 — 食堂一楼 包子+豆浆', reward: 3, pickup: '食堂一楼', delivery: '5号教学楼301', deadline: '2026-06-29 08:00', status: '待接单' },
  { id: 3, title: '帮忙搬行李 — 从2号楼到校门口', reward: 20, pickup: '2号宿舍楼', delivery: '学校南门', deadline: '2026-06-30 14:00', status: '待接单' },
  { id: 4, title: '代还图书 — 图书馆3本', reward: 4, pickup: '1号宿舍楼', delivery: '图书馆还书处', deadline: '2026-06-28 17:00', status: '已接单' },
  { id: 5, title: '代打印资料 — 论文20页', reward: 6, pickup: '线上发送', delivery: '2号教学楼', deadline: '2026-06-29 12:00', status: '已接单' },
  { id: 6, title: '校园跑腿 — 交材料到教务处', reward: 8, pickup: '系办公室', delivery: '教务处（行政楼）', deadline: '2026-06-30 16:00', status: '待接单' },
]

const filteredItems = computed(() => {
  let result = items
  if (activeTab.value === 'pending') result = result.filter(i => i.status === '待接单')
  if (activeTab.value === 'taken') result = result.filter(i => i.status === '已接单')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(q) || item.pickup.toLowerCase().includes(q) || item.delivery.toLowerCase().includes(q))
  }
  return result
})
</script>

<template>
  <section class="page-errand">
    <div class="page-header">
      <h2>🏃 跑腿委托</h2>
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

    <!-- 列表 -->
    <div class="errand-list">
      <div v-for="item in filteredItems" :key="item.id" class="errand-card">
        <div class="errand-header">
          <h3 class="errand-title">{{ item.title }}</h3>
          <span :class="['status-tag', item.status === '待接单' ? 'pending' : 'taken']">
            {{ item.status }}
          </span>
        </div>
        <div class="route-line">
          <span class="route-point pickup">📦 {{ item.pickup }}</span>
          <span class="route-arrow">→</span>
          <span class="route-point delivery">📍 {{ item.delivery }}</span>
        </div>
        <div class="errand-footer">
          <span class="reward" v-if="item.reward > 0">💰 报酬 ¥{{ item.reward }}</span>
          <span class="reward free" v-else>🤝 免费帮忙</span>
          <span class="deadline">⏰ {{ item.deadline }}</span>
        </div>
      </div>
      <p v-if="!filteredItems.length" class="empty-tip">暂无跑腿任务</p>
    </div>
  </section>
</template>

<style scoped>
.page-errand {
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

.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
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
  margin-bottom: 20px;
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

.errand-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.errand-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
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
  margin-bottom: 10px;
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
</style>
