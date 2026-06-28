<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '张三',
  avatar: '',
  studentId: '2024001',
  phone: '138****8888',
  wechat: 'zhangsan_wx',
})

const activeTab = ref<'published' | 'joined'>('published')

interface PublishedItem {
  id: number
  title: string
  category: string
  date: string
  status: string
}

const publishedItems: PublishedItem[] = [
  { id: 1, title: '二手自行车 — 9成新', category: '二手交易', date: '2026-06-25', status: '在售' },
  { id: 2, title: '奶茶拼单 — 满减差2人', category: '拼单搭子', date: '2026-06-26', status: '进行中' },
  { id: 3, title: '代取快递 — 北门驿站', category: '跑腿委托', date: '2026-06-27', status: '已接单' },
]

const joinedItems: PublishedItem[] = [
  { id: 101, title: '水果拼单 — 当季樱桃5斤装', category: '拼单搭子', date: '2026-06-27', status: '已加入' },
  { id: 102, title: '找室友拼网费 — 半年', category: '拼单搭子', date: '2026-06-26', status: '已加入' },
]
</script>

<template>
  <section class="page-user-center">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="avatar">{{ user.avatar || '👤' }}</div>
      <div class="user-info">
        <h2 class="user-name">{{ user.name }}</h2>
        <p class="user-detail">学号: {{ user.studentId }}</p>
        <p class="user-detail">手机: {{ user.phone }}</p>
        <p class="user-detail">微信: {{ user.wechat }}</p>
      </div>
      <button class="edit-btn">编辑资料</button>
    </div>

    <!-- 统计概览 -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-num">{{ publishedItems.length }}</span>
        <span class="stat-label">已发布</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ joinedItems.length }}</span>
        <span class="stat-label">已参与</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">3</span>
        <span class="stat-label">已完成</span>
      </div>
    </div>

    <!-- 发布/参与 切换 -->
    <nav class="tab-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'published' }]"
        @click="activeTab = 'published'"
      >
        我发布的
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'joined' }]"
        @click="activeTab = 'joined'"
      >
        我参与的
      </button>
    </nav>

    <!-- 列表 -->
    <div class="item-list">
      <div
        v-for="item in activeTab === 'published' ? publishedItems : joinedItems"
        :key="item.id"
        class="item-card"
      >
        <div class="item-main">
          <h3 class="item-title">{{ item.title }}</h3>
          <div class="item-meta">
            <span class="item-category">{{ item.category }}</span>
            <span class="item-date">{{ item.date }}</span>
          </div>
        </div>
        <span :class="['item-status', { active: item.status === '在售' || item.status === '进行中' }]">
          {{ item.status }}
        </span>
      </div>
      <p v-if="!publishedItems.length && !joinedItems.length" class="empty-tip">暂无记录</p>
    </div>
  </section>
</template>

<style scoped>
.page-user-center {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #ecf5ff, #f0f7ff);
  border-radius: 12px;
  border: 1px solid #c6e2ff;
  margin-bottom: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
  border: 2px solid #409eff;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 6px;
  font-size: 20px;
  color: #303133;
}

.user-detail {
  margin: 0 0 2px;
  font-size: 13px;
  color: #909399;
}

.edit-btn {
  padding: 6px 16px;
  border: 1px solid #409eff;
  border-radius: 6px;
  background: #fff;
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.edit-btn:hover {
  background: #409eff;
  color: #fff;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 14px 8px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 8px 24px;
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

.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 6px;
  font-size: 15px;
  color: #303133;
}

.item-meta {
  display: flex;
  gap: 10px;
}

.item-category {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 1px 8px;
  border-radius: 4px;
}

.item-date {
  font-size: 12px;
  color: #c0c4cc;
}

.item-status {
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  flex-shrink: 0;
  margin-left: 12px;
}

.item-status.active {
  color: #67c23a;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
}
</style>
