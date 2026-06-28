<script setup lang="ts">
// 列表页 — 商品/信息列表展示，支持点击跳转详情页（携带 id 参数）

interface ListItem {
  id: number
  title: string
  category: string
  price: number
}

const items: ListItem[] = [
  { id: 1, title: '二手自行车 — 9成新', category: '二手交易', price: 200 },
  { id: 2, title: '图书馆拾到校园卡', category: '失物招领', price: 0 },
  { id: 3, title: '奶茶拼单 — 满减差2人', category: '拼单搭子', price: 15 },
  { id: 4, title: '代取快递 — 北门驿站', category: '跑腿委托', price: 5 },
  { id: 5, title: '机械键盘 Cherry 青轴', category: '二手交易', price: 350 },
  { id: 6, title: '找室友拼网费 — 半年', category: '拼单搭子', price: 120 },
]
</script>

<template>
  <section class="page-list">
    <h2>列表页</h2>
    <p>浏览商品与信息列表，点击条目查看详情。</p>

    <div class="item-list">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="item-card"
      >
        <div class="item-header">
          <span class="item-category">{{ item.category }}</span>
          <span class="item-price" v-if="item.price > 0">¥{{ item.price }}</span>
          <span class="item-price free" v-else>免费</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <span class="item-arrow">查看详情 →</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.page-list {
  padding: 16px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.item-card {
  display: block;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-category {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #e6a23c;
}

.item-price.free {
  color: #67c23a;
}

.item-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.item-arrow {
  font-size: 13px;
  color: #409eff;
}
</style>
