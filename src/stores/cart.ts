import { defineStore } from 'pinia'

export interface CartItem {
  type: 'secondHand' | 'lostAndFound' | 'groupBuy' | 'errand'
  itemId: number
  title: string
  price?: number
  location?: string
  addedAt: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    count: (state) => state.items.length,

    /** 按类型分组计数 */
    countByType: (state) => {
      const map: Record<string, number> = {}
      for (const item of state.items) {
        map[item.type] = (map[item.type] || 0) + 1
      }
      return map
    },
  },

  actions: {
    isInCart(type: CartItem['type'], itemId: number): boolean {
      return this.items.some((i) => i.type === type && i.itemId === itemId)
    },

    addToCart(item: Omit<CartItem, 'addedAt'>) {
      if (this.isInCart(item.type, item.itemId)) return
      this.items.push({
        ...item,
        addedAt: new Date().toISOString(),
      })
    },

    removeFromCart(type: CartItem['type'], itemId: number) {
      const index = this.items.findIndex((i) => i.type === type && i.itemId === itemId)
      if (index !== -1) this.items.splice(index, 1)
    },

    toggleCart(item: Omit<CartItem, 'addedAt'>): boolean {
      if (this.isInCart(item.type, item.itemId)) {
        this.removeFromCart(item.type, item.itemId)
        return false
      } else {
        this.addToCart(item)
        return true
      }
    },

    /** 批量移除 */
    removeBatch(ids: { type: CartItem['type']; itemId: number }[]) {
      const keySet = new Set(ids.map((i) => `${i.type}-${i.itemId}`))
      this.items = this.items.filter((i) => !keySet.has(`${i.type}-${i.itemId}`))
    },

    clearCart() {
      this.items = []
    },
  },
})
