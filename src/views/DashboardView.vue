<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useAsync } from '@/composables/useAsync'
import { getSecondHandList } from '@/api/secondHand'
import { getLostFoundList } from '@/api/lostFound'
import { getGroupBuyList } from '@/api/groupBuy'
import { getErrandList } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

use([PieChart, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

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

/** 统计数字 */
function getStats(data: typeof allData) {
  if (!data) return { total: 0, today: 0, users: 0, done: 0 }
  const all = [...data.secondHand, ...data.lostAndFound, ...data.groupBuy, ...data.errand]
  const today = new Date().toISOString().slice(0, 10)
  return {
    total: all.length,
    today: all.filter((i: any) => i.createdAt?.startsWith(today)).length,
    users: new Set(all.map((i: any) => i.sellerId || i.publisherId || i.creatorId)).size,
    done: all.filter((i: any) =>
      ['已售', '已解决', '已完成'].includes(i.status)
    ).length,
  }
}

/** 分类占比饼图 */
const pieOption = computed(() => {
  if (!allData.value) return {}
  const d = allData.value
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: [
        { value: d.secondHand.length, name: '二手交易', itemStyle: { color: '#409eff' } },
        { value: d.lostAndFound.length, name: '失物招领', itemStyle: { color: '#f56c6c' } },
        { value: d.groupBuy.length, name: '拼单搭子', itemStyle: { color: '#67c23a' } },
        { value: d.errand.length, name: '跑腿委托', itemStyle: { color: '#e6a23c' } },
      ],
    }],
  }
})

/** 每日发布趋势 */
const lineOption = computed(() => {
  if (!allData.value) return {}
  const d = allData.value
  const dateCount: Record<string, number> = {}
  ;[...d.secondHand, ...d.lostAndFound, ...d.groupBuy, ...d.errand].forEach((i: any) => {
    const day = i.createdAt?.slice(0, 10)
    if (day) dateCount[day] = (dateCount[day] || 0) + 1
  })
  const sorted = Object.entries(dateCount).sort((a, b) => a[0].localeCompare(b[0]))
  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: sorted.map(([k]) => k.slice(5)) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{ type: 'line', data: sorted.map(([, v]) => v), smooth: true, itemStyle: { color: '#409eff' } }],
  }
})

/** 状态分布 */
const barOption = computed(() => {
  if (!allData.value) return {}
  const d = allData.value
  const statuses: Record<string, number> = {}
  ;[...d.secondHand, ...d.lostAndFound, ...d.groupBuy, ...d.errand].forEach((i: any) => {
    statuses[i.status] = (statuses[i.status] || 0) + 1
  })
  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Object.keys(statuses) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      type: 'bar',
      data: Object.values(statuses),
      itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] },
    }],
  }
})
</script>

<template>
  <section class="page-dashboard">
    <div class="page-header">
      <h1>📊 趋势看板</h1>
      <p>校园轻集市数据可视化分析</p>
    </div>

    <LoadingState v-if="loading" text="正在加载数据看板…" />

    <ErrorState
      v-else-if="error"
      :message="error || '请求失败，请稍后重试'"
      show-retry
      @retry="execute()"
    />

    <EmptyState v-else-if="!allData" text="暂无数据" />

    <template v-else>
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card"><span class="stat-value">{{ getStats(allData).total }}</span><span class="stat-label">信息总数</span></div>
        <div class="stat-card"><span class="stat-value">{{ getStats(allData).today }}</span><span class="stat-label">今日新增</span></div>
        <div class="stat-card"><span class="stat-value">{{ getStats(allData).users }}</span><span class="stat-label">活跃用户</span></div>
        <div class="stat-card"><span class="stat-value">{{ getStats(allData).done }}</span><span class="stat-label">已完成</span></div>
      </div>

      <!-- 图表 -->
      <div class="charts-grid">
        <div class="chart-card">
          <h3>📈 每日发布趋势</h3>
          <VChart :option="lineOption" autoresize style="height:300px;" />
        </div>
        <div class="chart-card">
          <h3>🍩 分类占比</h3>
          <VChart :option="pieOption" autoresize style="height:300px;" />
        </div>
        <div class="chart-card chart-full">
          <h3>📊 状态分布</h3>
          <VChart :option="barOption" autoresize style="height:280px;" />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page-dashboard { padding: 16px; }
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.page-header p { color: #909399; font-size: 14px; }


.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px; text-align: center; }
.stat-value { display: block; font-size: 28px; font-weight: 700; color: #409eff; }
.stat-label { display: block; margin-top: 6px; font-size: 13px; color: #909399; }

.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.chart-card { background: #fff; border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px; }
.chart-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #303133; }
.chart-full { grid-column: span 2; }

@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } .chart-full { grid-column: span 1; } }
</style>
