<script setup lang="ts">
// 看板页 — 统计概览 / 数据看板
const stats = [
  { label: '商品总数', value: 128 },
  { label: '今日新增', value: 12 },
  { label: '活跃用户', value: 56 },
  { label: '成交订单', value: 89 },
]
</script>

<template>
  <section class="page-board">
    <h2>看板页</h2>
    <p>校园轻集市数据概览。</p>

    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-board {
  padding: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.stat-card {
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #409eff;
}

.stat-label {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #909399;
}
</style>
