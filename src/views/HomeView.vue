<script setup lang="ts">
// 首页 — 项目入口，展示四类业务场景入口
const categories = [
  { key: 'secondHand', name: '二手交易', desc: '闲置物品买卖，物尽其用', icon: '🛒' },
  { key: 'lostAndFound', name: '失物招领', desc: '丢了东西？来这里找找', icon: '🔍' },
  { key: 'groupBuy', name: '拼单搭子', desc: '一起拼，更划算', icon: '🤝' },
  { key: 'errand', name: '跑腿委托', desc: '找人帮忙，省时省力', icon: '🏃' },
]
</script>

<template>
  <section class="page-home">
    <div class="welcome">
      <h2>项目启动成功</h2>
      <p>校园轻集市 — 你的校园生活服务平台</p>
    </div>

    <div class="categories">
      <div
        v-for="cat in categories"
        :key="cat.key"
        class="category-card"
      >
        <span class="category-icon">{{ cat.icon }}</span>
        <h3>{{ cat.name }}</h3>
        <p>{{ cat.desc }}</p>
      </div>
    </div>

    <div class="quick-links">
      <RouterLink to="/market" class="btn-primary">进入集市</RouterLink>
      <RouterLink to="/publish" class="btn-secondary">发布信息</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.welcome {
  text-align: center;
  margin-bottom: 32px;
}

.welcome h2 {
  color: #67c23a;
  font-size: 24px;
  margin-bottom: 8px;
}

.welcome p {
  color: #666;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.category-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: box-shadow 0.2s;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 8px;
}

.category-card h3 {
  margin: 0 0 4px;
  font-size: 16px;
  color: #333;
}

.category-card p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 10px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  transition: opacity 0.2s;
}

.btn-primary {
  background: #409eff;
  color: #fff;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.85;
}
</style>
