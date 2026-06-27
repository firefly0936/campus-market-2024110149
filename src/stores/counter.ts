import { defineStore } from 'pinia'
import { ref } from 'vue'

// 示例 Store — 后续由学生根据业务需求扩展
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
