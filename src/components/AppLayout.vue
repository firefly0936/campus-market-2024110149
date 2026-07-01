<script setup lang="ts">
import { watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import AppHeader from './AppHeader.vue'
import CartFloat from './CartFloat.vue'

const userStore = useUserStore()
const cartStore = useCartStore()

// 切换用户后清空购物车
watch(() => userStore.currentUser.id, () => cartStore.clearCart())
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>

    <CartFloat />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f5f7fb;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
