<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAsync } from '@/composables/useAsync'
import { getSecondHandList } from '@/api/secondHand'
import { getLostFoundList } from '@/api/lostFound'
import { getGroupBuyList } from '@/api/groupBuy'
import { getErrandList } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const { data: allData, loading, error, execute } = useAsync(async () => {
  const [sh, lf, gb, er] = await Promise.all([
    getSecondHandList(), getLostFoundList(), getGroupBuyList(), getErrandList(),
  ])
  return {
    secondHand: sh.data,
    lostAndFound: lf.data,
    groupBuy: gb.data,
    errand: er.data,
  }
})

onMounted(() => execute())

const todayStr = new Date().toISOString().slice(0, 10)

const stats = computed(() => {
  if (!allData.value) return []
  const { secondHand, lostAndFound, groupBuy, errand } = allData.value
  const all = [...secondHand, ...lostAndFound, ...groupBuy, ...errand]

  return [
    { label: '信息总数', value: all.length },
    {
      label: '今日新增',
      value: all.filter((i: any) => i.createdAt?.startsWith(todayStr)).length,
    },
    {
      label: '活跃用户',
      value: new Set(all.map((i: any) => i.sellerId || i.publisherId || i.creatorId)).size,
    },
    {
      label: '成交/完成',
      value: all.filter((i: any) =>
        ['已售', '已解决', '已完成', '已成团'].includes(i.status)
      ).length,
    },
  ]
})
</script>

<template>
  <section class="page-board">
    <h2>📊 数据看板</h2>
    <p>校园轻集市数据概览。</p>

    <LoadingState v-if="loading" text="正在加载数据看板…" />

    <ErrorState
      v-else-if="error"
      :message="error || '请求失败，请稍后重试'"
      show-retry
      @retry="execute()"
    />

    <EmptyState v-else-if="!allData" text="暂无数据" />

    <div v-else class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-board { padding: 16px; }


.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.stat-card {
  background: #fff;
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
