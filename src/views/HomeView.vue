<script setup lang="ts">
/** 四大业务场景入口 */
const sections = [
  {
    key: 'trade',
    name: '二手交易',
    desc: '闲置物品买卖，物尽其用，让旧物找到新主人',
    icon: '🛒',
    to: '/trade',
    color: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  {
    key: 'lost-found',
    name: '失物招领',
    desc: '丢了东西？捡到物品？来这里发布和查找',
    icon: '🔍',
    to: '/lost-found',
    color: '#fef3c7',
    borderColor: '#fde68a',
  },
  {
    key: 'group-buy',
    name: '拼单搭子',
    desc: '一起拼更划算，找到你的购物搭子',
    icon: '🤝',
    to: '/group-buy',
    color: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  {
    key: 'errand',
    name: '跑腿委托',
    desc: '找人帮忙取快递、带饭、排队，省时省力',
    icon: '🏃',
    to: '/errand',
    color: '#fdf2f8',
    borderColor: '#fbcfe8',
  },
]
</script>

<template>
  <section class="page-home">
    <!-- 左侧欢迎区 -->
    <div class="welcome">
      <h2>👋 欢迎来到校园轻集市</h2>
      <p>轻量、可信、面向校园生活 — 一站式解决你的校园交易需求</p>
    </div>

    <!-- 四大业务场景卡片 — 可点击跳转 -->
    <div class="sections-grid">
      <RouterLink
        v-for="sec in sections"
        :key="sec.key"
        :to="sec.to"
        class="section-card"
        :style="{ backgroundColor: sec.color, borderColor: sec.borderColor }"
      >
        <span class="section-icon">{{ sec.icon }}</span>
        <div class="section-body">
          <h3>{{ sec.name }}</h3>
          <p>{{ sec.desc }}</p>
        </div>
        <span class="section-arrow">→</span>
      </RouterLink>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <RouterLink to="/publish" class="publish-hero">
        ✍️ 发布信息
      </RouterLink>
      <RouterLink to="/market" class="market-link">
        浏览集市列表 →
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.page-home {
  padding: 0;
}

/* ── 欢迎区 — 左对齐 ── */
.welcome {
  text-align: left;
  margin-bottom: 36px;
}

.welcome h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.welcome p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

/* ── 四大业务卡片 ── */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.section-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  border: 2px solid;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.section-icon {
  font-size: 42px;
  flex-shrink: 0;
  line-height: 1;
}

.section-body {
  flex: 1;
  min-width: 0;
}

.section-body h3 {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 600;
  color: #1a1a2e;
}

.section-body p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.section-arrow {
  flex-shrink: 0;
  font-size: 20px;
  color: #9ca3af;
  transition: color 0.2s, transform 0.2s;
}

.section-card:hover .section-arrow {
  color: #2563eb;
  transform: translateX(4px);
}

/* ── 快捷操作 ── */
.quick-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.publish-hero {
  display: inline-block;
  padding: 14px 36px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.publish-hero:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}

.market-link {
  font-size: 14px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.market-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* ── 响应式 ── */
@media (max-width: 640px) {
  .sections-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .publish-hero {
    text-align: center;
  }
}
</style>
