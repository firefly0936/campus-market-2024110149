<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAsync } from '@/composables/useAsync'
import { getSecondHandDetail, type SecondHandItem } from '@/api/secondHand'
import { getLostFoundDetail, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuyDetail, type GroupBuyItem } from '@/api/groupBuy'
import { getErrandDetail, type ErrandItem } from '@/api/errand'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useFavoriteStore, type FavoriteType } from '@/stores/favorite'
import { useCartStore } from '@/stores/cart'

type DetailItem = SecondHandItem | LostFoundItem | GroupBuyItem | ErrandItem

const route = useRoute()
const router = useRouter()
const type = route.params.type as string
const id = Number(route.params.id)

/** 根据 type 选择对应的 API */
const apiMap: Record<string, (id: number) => Promise<{ data: DetailItem }>> = {
  secondHand: (id) => getSecondHandDetail(id),
  lostAndFound: (id) => getLostFoundDetail(id),
  groupBuy: (id) => getGroupBuyDetail(id),
  errand: (id) => getErrandDetail(id),
}

const fetchDetail = apiMap[type]
  ? () => apiMap[type](id).then(res => res.data)
  : () => Promise.reject(new Error(`未知类型: ${type}`))

const { data: item, loading, error, execute } = useAsync(fetchDetail)

onMounted(() => execute())

/** 类型中文映射 */
const typeLabel: Record<string, string> = {
  secondHand: '二手交易',
  lostAndFound: '失物招领',
  groupBuy: '拼单搭子',
  errand: '跑腿委托',
}

/** 类型对应的列表页 */
const listLink: Record<string, string> = {
  secondHand: '/trade',
  lostAndFound: '/lost-found',
  groupBuy: '/group-buy',
  errand: '/errand',
}

/** 从 item 中提取通用展示字段 */
const displayFields = computed(() => {
  if (!item.value) return []
  const i = item.value as Record<string, unknown>
  const fields: { label: string; value: string }[] = []

  if (type === 'secondHand') {
    if (i.price !== undefined) fields.push({ label: '价格', value: i.price === 0 ? '免费' : `¥${i.price}` })
    if (i.category) fields.push({ label: '分类', value: String(i.category) })
    if (i.condition) fields.push({ label: '成色', value: String(i.condition) })
    if (i.tradeLocation) fields.push({ label: '交易地点', value: String(i.tradeLocation) })
    if (i.status) fields.push({ label: '状态', value: String(i.status) })
  } else if (type === 'lostAndFound') {
    if (i.type) fields.push({ label: '类型', value: String(i.type) })
    if (i.location) fields.push({ label: '地点', value: String(i.location) })
    if (i.lostDate) fields.push({ label: '时间', value: String(i.lostDate) })
    if (i.status) fields.push({ label: '状态', value: String(i.status) })
  } else if (type === 'groupBuy') {
    if (i.targetCount !== undefined && i.currentCount !== undefined)
      fields.push({ label: '拼单进度', value: `${i.currentCount}/${i.targetCount} 人` })
    if (i.deadline) fields.push({ label: '截止日期', value: String(i.deadline) })
    if (i.meetingLocation) fields.push({ label: '集合地点', value: String(i.meetingLocation) })
    if (i.status) fields.push({ label: '状态', value: String(i.status) })
  } else if (type === 'errand') {
    if (i.reward !== undefined) fields.push({ label: '报酬', value: i.reward === 0 ? '免费帮忙' : `¥${i.reward}` })
    if (i.pickupLocation) fields.push({ label: '取件地点', value: String(i.pickupLocation) })
    if (i.deliveryLocation) fields.push({ label: '送达地点', value: String(i.deliveryLocation) })
    if (i.expectedTime) fields.push({ label: '期望完成', value: String(i.expectedTime) })
    if (i.status) fields.push({ label: '状态', value: String(i.status) })
  }

  return fields
})

const showContact = ref(false)
const contactInfo = computed(() => {
  if (!item.value) return ''
  const i = item.value as Record<string, unknown>
  return String(i.contact || '暂无联系方式')
})

// 收藏功能
const favStore = useFavoriteStore()
const isFavorited = computed(() => favStore.isFavorited(type as FavoriteType, id))
const itemTitle = computed(() => (item.value as Record<string, unknown>)?.title as string || '')

function toggleFav() {
  favStore.toggleFavorite(type as FavoriteType, id, itemTitle.value)
}

// 购物车功能
const cartStore = useCartStore()
const isInCart = computed(() => cartStore.isInCart(type as any, id))

function toggleCart() {
  const i = item.value as Record<string, unknown>
  cartStore.toggleCart({
    type: type as any,
    itemId: id,
    title: itemTitle.value,
    price: (i.price ?? i.reward) as number | undefined,
    location: (i.tradeLocation ?? i.location ?? i.pickupLocation) as string | undefined,
  })
}

function goBack() {
  const target = listLink[type] || '/market'
  router.push(target)
}
</script>

<template>
  <section class="page-detail">
    <!-- 面包屑 -->
    <nav class="breadcrumb">
      <RouterLink to="/">首页</RouterLink>
      <span> / </span>
      <RouterLink :to="listLink[type] || '/market'">
        {{ typeLabel[type] || '分类浏览' }}
      </RouterLink>
      <span> / </span>
      <span class="current">详情</span>
    </nav>

    <!-- loading 态 -->
    <LoadingState v-if="loading" text="正在加载详情…" />

    <!-- error 态 -->
    <ErrorState
      v-else-if="error"
      :message="error || '请求失败，请稍后重试'"
      show-retry
      @retry="execute()"
    />

    <!-- empty 态 -->
    <div v-else-if="!item" class="state-box">
      <EmptyState text="未找到该条目" />
    </div>

    <!-- 正常态 -->
    <template v-else>
      <ItemCard
        :title="(item as any).title || ''"
        :status="displayFields.find(f => f.label === '状态')?.value"
        status-class="tag--info"
        :tag="typeLabel[type]"
        tag-class="tag--type"
      >
        <!-- 图片（如有） -->
        <template v-if="(item as any).images?.length" #description>
          <div class="image-row">
            <img
              v-for="(img, idx) in (item as any).images"
              :key="idx"
              :src="img"
              class="detail-image"
              @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
            />
          </div>
        </template>

        <!-- 描述 -->
        <template #description>
          <p class="desc-text">{{ (item as any).description }}</p>
        </template>

        <!-- 关键字段 -->
        <template #meta>
          <div class="field-grid">
            <div v-for="f in displayFields" :key="f.label" class="field-item">
              <span class="field-label">{{ f.label }}</span>
              <span
                class="field-value"
                :class="{
                  'text-green': f.value === '免费' || f.value === '免费帮忙' || f.value === '已解决',
                  'text-orange': f.value === '待接单' || f.value === '未解决',
                  'text-blue': f.value === '已接单' || f.value === '在售',
                }"
              >
                {{ f.value }}
              </span>
            </div>
          </div>
        </template>

        <!-- 联系方式 + 收藏 + 操作 -->
        <template #footer>
          <div class="footer-row">
            <button class="contact-btn" @click="showContact = !showContact">
              {{ showContact ? '隐藏联系方式' : '📱 查看联系方式' }}
            </button>
            <button
              :class="['fav-btn', { favorited: isFavorited }]"
              @click="toggleFav"
            >
              {{ isFavorited ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
            <button
              :class="['cart-btn', { inCart: isInCart }]"
              @click="toggleCart"
            >
              {{ isInCart ? '🛒 已在购物车' : '🛒 加入购物车' }}
            </button>
            <button class="back-btn" @click="goBack">← 返回列表</button>
          </div>
          <div v-if="showContact" class="contact-info">
            {{ contactInfo }}
          </div>
        </template>
      </ItemCard>
    </template>
  </section>
</template>

<style scoped>
.page-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 13px;
  color: #909399;
}
.breadcrumb a {
  color: #409eff;
  text-decoration: none;
}
.breadcrumb .current {
  color: #303133;
}


/* 图片 */
.image-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.detail-image {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

/* 描述 */
.desc-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 字段网格 */
.field-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.field-item {
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field-label {
  font-size: 12px;
  color: #909399;
}
.field-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}
.text-green {
  color: #67c23a;
}
.text-orange {
  color: #e6a23c;
}
.text-blue {
  color: #409eff;
}

/* 底部操作 */
.footer-row {
  display: flex;
  gap: 12px;
}
.contact-btn {
  padding: 10px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.contact-btn:hover {
  background: #337ecc;
}
.fav-btn {
  padding: 10px 24px;
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.fav-btn:hover {
  border-color: #f56c6c;
  color: #f56c6c;
}
.fav-btn.favorited {
  border-color: #f56c6c;
  color: #f56c6c;
  background: #fef0f0;
}
.cart-btn {
  padding: 10px 24px;
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.cart-btn:hover {
  border-color: #e6a23c;
  color: #e6a23c;
}
.cart-btn.inCart {
  border-color: #e6a23c;
  color: #e6a23c;
  background: #fef7f0;
}
.back-btn {
  padding: 10px 24px;
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.back-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.contact-info {
  margin-top: 10px;
  padding: 12px;
  background: #ecf5ff;
  border: 1px solid #c6e2ff;
  border-radius: 6px;
  font-size: 14px;
  color: #303133;
}

@media (max-width: 600px) {
  .field-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
