<script setup lang="ts">
</script>

<template>
  <nav class="app-nav">
    <RouterLink to="/" exact>首页</RouterLink>
    <RouterLink to="/market">集市列表</RouterLink>
    <RouterLink to="/message">消息</RouterLink>
    <RouterLink to="/user">我的</RouterLink>
    <RouterLink to="/publish" class="nav-publish">发布</RouterLink>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.app-nav a {
  color: #333;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s;
}

.app-nav a:hover {
  color: #2563eb;
}

.app-nav a.router-link-active {
  color: #2563eb;
  font-weight: 600;
}

/* 发布按钮 — 显眼样式 */
.nav-publish {
  padding: 6px 18px;
  background: #2563eb;
  color: #fff !important;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s, transform 0.2s;
}

.nav-publish:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.nav-publish.router-link-active {
  background: #1e40af;
  color: #fff !important;
}
</style>
