import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 示例 Store — 保留作为教学参考
 *
 * ⚠️ Day5 起，请使用以下专用 Store：
 * - `@/stores/user` — 用户信息管理（useUserStore）
 * - `@/stores/favorite` — 收藏状态管理（useFavoriteStore）
 *
 * 本文件仅作为 Pinia defineStore 的语法参考保留，
 * 项目中实际使用的用户状态已迁移至 user.ts。
 */
export const useAppStore = defineStore('app', () => {
  const currentUser = ref<{ id: number; nickname: string } | null>(null)

  function setUser(user: { id: number; nickname: string }) {
    currentUser.value = user
  }

  function clearUser() {
    currentUser.value = null
  }

  return { currentUser, setUser, clearUser }
})
