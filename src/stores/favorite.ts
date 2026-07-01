import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** 业务类型 */
export type FavoriteType = 'secondHand' | 'lostAndFound' | 'groupBuy' | 'errand'

/** 收藏条目 */
export interface FavoriteItem {
  /** 业务类型 */
  type: FavoriteType
  /** 物品 ID */
  itemId: number
  /** 标题（用于列表展示） */
  title: string
  /** 收藏时间 */
  addedAt: string
}

/**
 * 收藏 Store — 管理用户收藏状态
 *
 * 使用场景：
 * - 列表页：显示收藏按钮、切换收藏状态
 * - 详情页：收藏/取消收藏操作
 * - 个人中心：展示收藏列表
 *
 * 设计原则：
 * - 收藏是跨页面共享状态（列表页和个人中心都需要）
 * - 不存放仅属于单个页面的临时数据
 */
export const useFavoriteStore = defineStore('favorite', () => {
  // ── 状态 ──
  /** 收藏列表 */
  const favorites = ref<FavoriteItem[]>([])

  // ── 计算属性 ──

  /** 收藏总数 */
  const count = computed(() => favorites.value.length)

  /** 按类型分组的收藏数量 */
  const countByType = computed(() => {
    const map: Record<string, number> = {}
    for (const f of favorites.value) {
      map[f.type] = (map[f.type] || 0) + 1
    }
    return map
  })

  // ── 方法 ──

  /**
   * 判断某个物品是否已收藏
   * @param type 业务类型
   * @param itemId 物品 ID
   */
  function isFavorited(type: FavoriteType, itemId: number): boolean {
    return favorites.value.some((f) => f.type === type && f.itemId === itemId)
  }

  /**
   * 添加收藏
   * @param type 业务类型
   * @param itemId 物品 ID
   * @param title 标题
   */
  function addFavorite(type: FavoriteType, itemId: number, title: string) {
    if (isFavorited(type, itemId)) return
    favorites.value.push({
      type,
      itemId,
      title,
      addedAt: new Date().toISOString(),
    })
  }

  /**
   * 取消收藏
   * @param type 业务类型
   * @param itemId 物品 ID
   */
  function removeFavorite(type: FavoriteType, itemId: number) {
    const index = favorites.value.findIndex((f) => f.type === type && f.itemId === itemId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
  }

  /**
   * 切换收藏状态（有则取消，无则添加）
   * @param type 业务类型
   * @param itemId 物品 ID
   * @param title 标题（仅在添加时需要）
   * @returns 操作后的收藏状态
   */
  function toggleFavorite(type: FavoriteType, itemId: number, title: string): boolean {
    if (isFavorited(type, itemId)) {
      removeFavorite(type, itemId)
      return false
    } else {
      addFavorite(type, itemId, title)
      return true
    }
  }

  /**
   * 获取指定类型的收藏列表
   * @param type 业务类型（可选，不传则返回全部）
   */
  function getFavoritesByType(type?: FavoriteType): FavoriteItem[] {
    if (!type) return favorites.value
    return favorites.value.filter((f) => f.type === type)
  }

  /** 清空所有收藏 */
  function clearAll() {
    favorites.value = []
  }

  return {
    // 状态
    favorites,
    // 计算属性
    count,
    countByType,
    // 方法
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearAll,
  }
})
