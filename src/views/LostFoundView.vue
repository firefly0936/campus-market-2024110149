<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'all' | 'lost' | 'found'>('all')
const searchQuery = ref('')

interface LostFoundItem {
  id: number
  title: string
  type: '失物' | '招领'
  location: string
  date: string
  status: string
  description: string
}

const items: LostFoundItem[] = [
  { id: 1, title: '蓝色校园卡 — 张三', type: '招领', location: '图书馆二楼', date: '2026-06-25', status: '待认领', description: '在图书馆二楼阅览室拾到' },
  { id: 2, title: '黑色双肩包', type: '失物', location: '食堂一楼', date: '2026-06-24', status: '寻找中', description: '吃饭时遗忘在座位，内有课本和文具' },
  { id: 3, title: '华为蓝牙耳机 FreeBuds', type: '招领', location: '3号教学楼302', date: '2026-06-26', status: '待认领', description: '白色充电盒，下课后发现' },
  { id: 4, title: '学生证 — 李四', type: '失物', location: '操场', date: '2026-06-23', status: '寻找中', description: '可能掉在操场跑道附近' },
  { id: 5, title: '钥匙串（3把钥匙+U盘）', type: '招领', location: '北门传达室', date: '2026-06-27', status: '待认领', description: '北门入口处拾到' },
  { id: 6, title: '水杯 膳魔师 500ml 蓝色', type: '失物', location: '图书馆自习室', date: '2026-06-26', status: '寻找中', description: '遗忘在自习室B区' },
]

const filteredItems = computed(() => {
  let result = items
  if (activeTab.value === 'lost') result = result.filter(item => item.type === '失物')
  if (activeTab.value === 'found') result = result.filter(item => item.type === '招领')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q))
  }
  return result
})
</script>

<template>
  <section class="page-lost-found">
    <div class="page-header">
      <h2>🔍 失物招领</h2>
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

    <!-- 列表 -->
    <div class="lf-list">
      <div v-for="item in filteredItems" :key="item.id" class="lf-card">
        <div class="lf-header">
          <span :class="['type-badge', item.type === '失物' ? 'lost' : 'found']">
            {{ item.type }}
          </span>
          <span :class="['status-badge', { resolved: item.status !== '寻找中' && item.status !== '待认领' }]">
            {{ item.status }}
          </span>
        </div>
        <h3 class="lf-title">{{ item.title }}</h3>
        <p class="lf-desc">{{ item.description }}</p>
        <div class="lf-meta">
          <span>📍 {{ item.location }}</span>
          <span>📅 {{ item.date }}</span>
        </div>
      </div>
      <p v-if="!filteredItems.length" class="empty-tip">暂无相关记录</p>
    </div>
  </section>
</template>

<style scoped>
.page-lost-found {
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

.lf-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lf-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.lf-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.lf-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
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
</style>
