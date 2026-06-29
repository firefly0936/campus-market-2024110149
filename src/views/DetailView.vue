<script setup lang="ts">
// 详情页 — 接收路由 id 参数，展示对应条目详情
import { useRoute } from 'vue-router'

const route = useRoute()
const itemId = route.params.id
</script>

<template>
  <section class="page-detail">
    <h2>详情页</h2>
    <p>当前查看条目 ID：<strong>{{ itemId }}</strong></p>
    <p>从列表页携带 id 参数跳转而来。</p>

    <div class="back-link">
      <RouterLink to="/market">← 返回列表</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.page-detail {
  padding: 16px;
}

.page-detail strong {
  color: #409eff;
  font-size: 18px;
}

.back-link {
  margin-top: 20px;
}

.back-link a {
  color: #409eff;
  text-decoration: none;
}
</style>
