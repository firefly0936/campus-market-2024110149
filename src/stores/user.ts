import { defineStore } from 'pinia'

export interface CurrentUser {
  id: number
  username: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
}

const STORAGE_KEY = 'campus-market-current-user'

function loadFromStorage(): { isLoggedIn: boolean; currentUser: CurrentUser | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const user = JSON.parse(raw) as CurrentUser
      return { isLoggedIn: true, currentUser: user }
    }
  } catch {
    // 数据损坏时忽略
  }
  return { isLoggedIn: false, currentUser: null }
}

function saveToStorage(user: CurrentUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function removeFromStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export const useUserStore = defineStore('user', {
  state: () => {
    const saved = loadFromStorage()
    return {
      isLoggedIn: saved.isLoggedIn,
      currentUser: saved.currentUser,
    }
  },

  getters: {
    displayName: (state) => state.currentUser?.name ?? '',
    userDescription: (state) => {
      if (!state.currentUser) return ''
      return `${state.currentUser.college} · ${state.currentUser.grade}`
    },
  },

  actions: {
    /** 登录成功后保存用户 */
    setLogin(user: CurrentUser) {
      this.currentUser = user
      this.isLoggedIn = true
      saveToStorage(user)
    },

    /** 退出登录 */
    logout() {
      this.currentUser = null
      this.isLoggedIn = false
      removeFromStorage()
    },

    /** App 启动时恢复登录状态（已在 state 初始化中处理，保留方法供手动调用） */
    restoreLogin() {
      const saved = loadFromStorage()
      if (saved.isLoggedIn && saved.currentUser) {
        this.currentUser = saved.currentUser
        this.isLoggedIn = true
      }
    },

    updateProfile(payload: Partial<CurrentUser>) {
      if (!this.currentUser) return
      this.currentUser = { ...this.currentUser, ...payload }
      saveToStorage(this.currentUser)
    },
  },
})
