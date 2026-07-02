<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="app-nav">
    <RouterLink to="/" exact>首页</RouterLink>
    <RouterLink to="/trade">二手交易</RouterLink>
    <RouterLink to="/lost-found">失物招领</RouterLink>
    <RouterLink to="/group-buy">拼单搭子</RouterLink>
    <RouterLink to="/errand">跑腿委托</RouterLink>
    <RouterLink to="/message">消息</RouterLink>

    <template v-if="userStore.isLoggedIn">
      <RouterLink to="/user">{{ userStore.displayName }}</RouterLink>
      <a class="nav-logout" @click.prevent="handleLogout">退出</a>
    </template>
    <template v-else>
      <RouterLink to="/login">登录</RouterLink>
      <RouterLink to="/register">注册</RouterLink>
    </template>

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
  cursor: pointer;
}

.app-nav a:hover {
  color: #2563eb;
}

.app-nav a.router-link-active {
  color: #2563eb;
  font-weight: 600;
}

.nav-logout {
  color: #9ca3af !important;
  font-size: 14px !important;
}

.nav-logout:hover {
  color: #ef4444 !important;
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
