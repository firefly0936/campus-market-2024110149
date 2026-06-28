<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'all' | 'active' | 'completed'>('all')
const searchQuery = ref('')

interface GroupBuyItem {
  id: number
  title: string
  currentCount: number
  targetCount: number
  deadline: string
  location: string
  unitPrice: number
}

const items: GroupBuyItem[] = [
  { id: 1, title: '奶茶拼单 — 满减差2人', currentCount: 3, targetCount: 5, deadline: '2026-06-29', location: '南门奶茶店', unitPrice: 15 },
  { id: 2, title: '找室友拼网费 — 半年套餐', currentCount: 2, targetCount: 4, deadline: '2026-07-05', location: '线上', unitPrice: 120 },
  { id: 3, title: '外卖满减拼单 — 满50减20', currentCount: 1, targetCount: 3, deadline: '2026-06-28', location: '2号宿舍楼', unitPrice: 25 },
  { id: 4, title: '打印纸团购 — A4纸整箱', currentCount: 8, targetCount: 10, deadline: '2026-07-01', location: '教学楼大厅', unitPrice: 18 },
  { id: 5, title: '二手教材团购 — 考研数学全套', currentCount: 5, targetCount: 5, deadline: '2026-06-27', location: '图书馆', unitPrice: 60 },
  { id: 6, title: '水果拼单 — 当季樱桃5斤装', currentCount: 2, targetCount: 6, deadline: '2026-07-03', location: '北门', unitPrice: 45 },
]

const filteredItems = computed(() => {
  let result = items
  if (activeTab.value === 'active') result = result.filter(i => i.currentCount < i.targetCount)
  if (activeTab.value === 'completed') result = result.filter(i => i.currentCount >= i.targetCount)
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
  <section class="page-group-buy">
    <div class="page-header">
      <h2>🤝 拼单搭子</h2>
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

    <!-- 列表 -->
    <div class="gb-list">
      <div v-for="item in filteredItems" :key="item.id" class="gb-card">
        <h3 class="gb-title">{{ item.title }}</h3>
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
          <span class="meta-tag">💰 ¥{{ item.unitPrice }}/人</span>
          <span class="meta-tag">📅 {{ item.deadline }}</span>
          <span class="meta-tag">📍 {{ item.location }}</span>
        </div>
        <div class="gb-status" v-if="item.currentCount >= item.targetCount">
          ✅ 已成团
        </div>
      </div>
      <p v-if="!filteredItems.length" class="empty-tip">暂无拼单活动</p>
    </div>
  </section>
</template>

<style scoped>
.page-group-buy {
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

.gb-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gb-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.gb-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.gb-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #303133;
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
</style>
