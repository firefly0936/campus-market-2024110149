import { defineStore } from 'pinia'

interface CartItem {
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
  },

  actions: {
    isInCart(type: CartItem['type'], itemId: number): boolean {
      return this.items.some((i) => i.type === type && i.itemId === itemId)
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
        this.items.push({
          ...item,
          addedAt: new Date().toISOString(),
        })
        return true
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
