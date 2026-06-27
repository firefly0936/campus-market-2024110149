<script setup lang="ts"></script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>校园轻集市</h1>
      <p class="subtitle">AI 辅助前端工程实践种子项目</p>
      <nav class="app-nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/identity">身份创建</RouterLink>
        <RouterLink to="/market">集市列表</RouterLink>
        <RouterLink to="/publish">发布</RouterLink>
        <RouterLink to="/messages">消息中心</RouterLink>
        <RouterLink to="/profile">个人中心</RouterLink>
        <RouterLink to="/dashboard">趋势看板</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  text-align: center;
  margin-bottom: 32px;
}

.app-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.subtitle {
  margin: 8px 0 16px;
  color: #888;
  font-size: 14px;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.app-nav a {
  color: #409eff;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.2s;
}

.app-nav a:hover {
  background: #ecf5ff;
}

.app-nav a.router-link-exact-active {
  background: #409eff;
  color: #fff;
}

.app-main {
  padding: 24px 0;
}
</style>
