<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const open = ref(false)

const typeLabel: Record<string, string> = {
  secondHand: '二手交易',
  lostAndFound: '失物招领',
  groupBuy: '拼单搭子',
  errand: '跑腿委托',
}

function toggleDrawer() {
  open.value = !open.value
}

function handleRemove(type: string, itemId: number) {
  cartStore.removeFromCart(type as any, itemId)
}
</script>

<template>
  <!-- 浮动按钮 -->
  <button class="cart-float" @click="toggleDrawer" :class="{ active: open }">
    <span class="cart-icon">🛒</span>
    <span v-if="cartStore.count > 0" class="cart-badge">{{ cartStore.count }}</span>
  </button>

  <!-- 遮罩 -->
  <div v-if="open" class="cart-overlay" @click="open = false"></div>

  <!-- 抽屉 -->
  <Transition name="drawer-slide">
    <div v-if="open" class="cart-drawer">
      <div class="drawer-header">
        <h3>🛒 我的购物车 ({{ cartStore.count }})</h3>
        <button class="close-btn" @click="open = false">✕</button>
      </div>

      <!-- 空状态 -->
      <div v-if="cartStore.count === 0" class="empty-cart">
        <p>购物车是空的</p>
        <p class="hint">浏览集市时，点击「加入购物车」即可收藏感兴趣的物品</p>
      </div>

      <!-- 列表 -->
      <div v-else class="cart-list">
        <RouterLink
          v-for="item in cartStore.items"
          :key="item.type + '-' + item.itemId"
          :to="`/detail/${item.type}/${item.itemId}`"
          class="cart-item"
          @click="open = false"
        >
          <div class="cart-item-info">
            <span class="cart-type-tag">{{ typeLabel[item.type] || item.type }}</span>
            <h4 class="cart-item-title">{{ item.title }}</h4>
            <div class="cart-item-meta">
              <span v-if="item.price !== undefined && item.price > 0" class="cart-price">¥{{ item.price }}</span>
              <span v-if="item.price === 0" class="cart-price free">免费</span>
              <span v-if="item.location" class="cart-location">📍 {{ item.location }}</span>
            </div>
          </div>
          <button class="cart-remove-btn" @click.prevent.stop="handleRemove(item.type, item.itemId)">移除</button>
        </RouterLink>
      </div>

      <!-- 底部操作 -->
      <div v-if="cartStore.count > 0" class="drawer-footer">
        <button class="clear-btn" @click="cartStore.clearCart()">清空购物车</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── 浮动按钮 ── */
.cart-float {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 1000;
}
.cart-float:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.45);
}
.cart-float.active {
  background: #1d4ed8;
}
.cart-icon {
  font-size: 24px;
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  background: #f56c6c;
  color: #fff;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

/* ── 遮罩 ── */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1001;
}

/* ── 抽屉 ── */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 90vw;
  background: #fff;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}
.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover {
  background: #e5e7eb;
}

/* ── 空状态 ── */
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #909399;
}
.empty-cart .hint {
  font-size: 13px;
  color: #c0c4cc;
}

/* ── 列表 ── */
.cart-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: #409eff;
}
.cart-item-info {
  flex: 1;
  min-width: 0;
}
.cart-type-tag {
  font-size: 11px;
  color: #909399;
  background: #f0f2f5;
  padding: 1px 8px;
  border-radius: 4px;
}
.cart-item-title {
  margin: 6px 0 4px;
  font-size: 14px;
  color: #303133;
}
.cart-item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}
.cart-price {
  font-weight: 600;
  color: #e6a23c;
}
.cart-price.free {
  color: #67c23a;
}
.cart-remove-btn {
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  background: #f3f4f6;
  color: #909399;
  font-size: 12px;
  flex-shrink: 0;
  transition: all 0.2s;
}
.cart-remove-btn:hover {
  background: #fef0f0;
  color: #f56c6c;
}

/* ── 底部 ── */
.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}
.clear-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid #f56c6c;
  border-radius: 8px;
  background: #fff;
  color: #f56c6c;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.clear-btn:hover {
  background: #fef0f0;
}

/* ── 动画 ── */
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
