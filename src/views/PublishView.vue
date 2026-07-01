<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import FormField from '../components/FormField.vue'
import ViolationDialog from '../components/ViolationDialog.vue'
import { createTrade } from '../api/trade'
import { createLostFound } from '../api/lostFound'
import { createGroupBuy } from '../api/groupBuy'
import { createErrand } from '../api/errand'
import { checkContent, type FilterResult } from '../utils/contentFilter'
import { useUserStore } from '@/stores/user'

type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

const router = useRouter()
const userStore = useUserStore()
const publishType = ref<PublishType>('trade')
const submitting = ref(false)

// ── 内容违规检测 ──
const filterResult = ref<FilterResult | null>(null)
const showViolationDialog = ref(false)

const publishTypes: { key: PublishType; name: string; icon: string }[] = [
  { key: 'trade', name: '二手交易', icon: '🛒' },
  { key: 'lostFound', name: '失物招领', icon: '🔍' },
  { key: 'groupBuy', name: '拼单搭子', icon: '🤝' },
  { key: 'errand', name: '跑腿委托', icon: '🏃' },
]

const form = reactive({
  // 通用字段
  title: '',
  location: '',
  description: '',
  // 二手交易
  category: '',
  price: 0,
  condition: '',
  // 失物招领
  lostFoundType: 'lost',
  itemName: '',
  eventTime: '',
  // 拼单搭子
  groupType: '',
  targetCount: 2,
  deadline: '',
  // 跑腿委托
  taskType: '',
  reward: 0,
  from: '',
  to: '',
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  // 清除上一轮校验结果
  Object.keys(errors).forEach(k => delete errors[k])

  // ── 通用字段 ──
  if (!form.title.trim()) {
    errors.title = '请填写标题'
  }
  if (!form.description.trim()) {
    errors.description = '请填写描述'
  }

  // ── 二手交易 ──
  if (publishType.value === 'trade') {
    if (!form.category) {
      errors.category = '请选择商品分类'
    }
    if (form.price < 0) {
      errors.price = '价格不能为负数'
    }
    if (!form.condition) {
      errors.condition = '请选择成色'
    }
    if (!form.location.trim()) {
      errors.location = '请填写交易地点'
    }
  }

  // ── 失物招领 ──
  if (publishType.value === 'lostFound') {
    if (!form.itemName.trim()) {
      errors.itemName = '请填写物品名称'
    }
    if (!form.location.trim()) {
      errors.location = '请填写地点'
    }
    if (!form.eventTime) {
      errors.eventTime = '请选择时间'
    }
  }

  // ── 拼单搭子 ──
  if (publishType.value === 'groupBuy') {
    if (!form.groupType) {
      errors.groupType = '请选择拼单类型'
    }
    if (form.targetCount < 2) {
      errors.targetCount = '目标人数不能少于 2 人'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  // ── 跑腿委托 ──
  if (publishType.value === 'errand') {
    if (!form.taskType) {
      errors.taskType = '请输入任务类型'
    }
    if (form.reward < 0) {
      errors.reward = '酬劳不能为负数'
    }
    if (!form.from) {
      errors.from = '请输入取件地点'
    }
    if (!form.to) {
      errors.to = '请输入送达地点'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  return Object.values(errors).every((message) => !message)
}

function buildPayload() {
  const userId = userStore.currentUser.id
  const publisher = userStore.displayName
  const base = {
    title: form.title.trim(),
    description: form.description.trim(),
    publisherId: userId,
    publisher,
    createdAt: new Date().toISOString(),
  }
  switch (publishType.value) {
    case 'trade':
      return {
        ...base,
        category: form.category,
        price: form.price,
        condition: form.condition,
        tradeLocation: form.location.trim(),
        status: '在售',
        sellerId: userId,
      }
    case 'lostFound':
      return {
        ...base,
        type: form.lostFoundType === 'lost' ? '失物' : '招领',
        itemName: form.itemName.trim(),
        location: form.location.trim(),
        lostDate: form.eventTime,
        status: '未解决',
      }
    case 'groupBuy':
      return {
        ...base,
        groupType: form.groupType,
        targetCount: form.targetCount,
        currentCount: 0,
        deadline: form.deadline,
        meetingLocation: form.location.trim(),
        status: '进行中',
        creatorId: userId,
      }
    case 'errand':
      return {
        ...base,
        taskType: form.taskType.trim(),
        reward: form.reward,
        pickupLocation: form.from.trim(),
        deliveryLocation: form.to.trim(),
        expectedTime: form.deadline,
        status: '待接单',
      }
  }
}

/**
 * 提取需要检测的文本字段
 */
function extractTextFields(payload: Record<string, unknown>): Record<string, string> {
  const textFields: Record<string, string> = {}
  // 只提取字符串类型的字段进行违规检测
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string' && value.trim().length > 0) {
      textFields[key] = value.trim()
    }
  }
  return textFields
}

async function handleSubmit() {
  if (!validate()) return

  const payload = buildPayload()
  const textFields = extractTextFields(payload)

  // 内容违规检测
  const result = checkContent(textFields)
  if (!result.passed || result.warnings.length > 0) {
    filterResult.value = result
    showViolationDialog.value = true
    return
  }

  // 无违规，直接提交
  await doPublish(payload)
}

/** 用户确认后继续发布（仅有 warning 时） */
async function handleProceed() {
  showViolationDialog.value = false
  const payload = buildPayload()
  await doPublish(payload)
}

/** 用户取消发布，返回修改 */
function handleCancelPublish() {
  showViolationDialog.value = false
}

/** 实际执行发布请求 */
async function doPublish(payload: Record<string, unknown>) {
  submitting.value = true
  try {
    switch (publishType.value) {
      case 'trade':
        await createTrade(payload)
        break
      case 'lostFound':
        await createLostFound(payload)
        break
      case 'groupBuy':
        await createGroupBuy(payload)
        break
      case 'errand':
        await createErrand(payload)
        break
    }
    const routeMap: Record<PublishType, string> = {
      trade: '/trade',
      lostFound: '/lost-found',
      groupBuy: '/group-buy',
      errand: '/errand',
    }
    router.push(routeMap[publishType.value])
  } catch (error) {
    console.error(error)
    window.alert('发布失败，请检查 Mock 服务是否正常运行')
  } finally {
    submitting.value = false
  }
}

function clearErrors() {
  Object.keys(errors).forEach(k => delete errors[k])
}

function resetForm() {
  form.title = ''
  form.location = ''
  form.description = ''
  form.category = ''
  form.price = 0
  form.condition = ''
  form.lostFoundType = 'lost'
  form.itemName = ''
  form.eventTime = ''
  form.groupType = ''
  form.targetCount = 2
  form.deadline = ''
  form.taskType = ''
  form.reward = 0
  form.from = ''
  form.to = ''

  clearErrors()
}

// 发布类型切换时重置表单，避免不同类型之间残留无关字段
watch(publishType, () => {
  resetForm()
})

const today = computed(() => new Date().toISOString().slice(0, 10))
const now = computed(() => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
})
</script>

<template>
  <section class="page-publish">
    <header class="page-header">
      <h2>发布信息</h2>
      <p>选择类型并填写对应的信息。</p>
    </header>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <!-- ── 发布类型选择 ── -->
      <div class="section">
        <div class="section-title">发布类型</div>
        <div class="category-picker">
          <button
            v-for="pt in publishTypes"
            :key="pt.key"
            type="button"
            :class="['cat-option', { active: publishType === pt.key }]"
            @click="publishType = pt.key"
          >
            <span class="cat-icon">{{ pt.icon }}</span>
            <span class="cat-name">{{ pt.name }}</span>
          </button>
        </div>
      </div>

      <!-- ── 通用字段 ── -->
      <div class="section">
        <div class="section-title">基本信息</div>

        <FormField label="标题" required :error="errors.title">
          <input
            v-model.trim="form.title"
            type="text"
            placeholder="请输入标题"
            :class="{ invalid: errors.title }"
          />
        </FormField>

        <FormField label="地点" required :error="errors.location">
          <input
            v-model.trim="form.location"
            type="text"
            placeholder="请输入地点"
            :class="{ invalid: errors.location }"
          />
        </FormField>

        <FormField label="描述" required :error="errors.description">
          <textarea
            v-model.trim="form.description"
            rows="4"
            placeholder="请简要描述具体情况"
            :class="{ invalid: errors.description }"
          ></textarea>
        </FormField>
      </div>

      <!-- ═══════ 专属字段 ═══════ -->
      <Transition name="fields-fade" mode="out-in">
        <!-- 二手交易 -->
        <div v-if="publishType === 'trade'" key="trade" class="section section-fields">
          <div class="section-title">🛒 交易信息</div>

          <FormField label="商品分类" required :error="errors.category">
            <select v-model="form.category" :class="{ invalid: errors.category }">
              <option value="">请选择分类</option>
              <option>电子产品</option>
              <option>教材教辅</option>
              <option>出行工具</option>
              <option>生活用品</option>
              <option>服饰鞋包</option>
              <option>运动户外</option>
              <option>图书音像</option>
              <option>其他</option>
            </select>
          </FormField>

          <FormField label="价格 (¥)" required :error="errors.price">
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              placeholder="0 表示免费"
              :class="{ invalid: errors.price }"
            />
          </FormField>

          <FormField label="成色" required :error="errors.condition">
            <select v-model="form.condition" :class="{ invalid: errors.condition }">
              <option value="">请选择成色</option>
              <option>全新</option>
              <option>九成新</option>
              <option>八成新</option>
              <option>七成新及以下</option>
            </select>
          </FormField>
        </div>

        <!-- 失物招领 -->
        <div v-else-if="publishType === 'lostFound'" key="lostFound" class="section section-fields">
          <div class="section-title">🔍 失物/招领信息</div>

          <FormField label="类型">
            <div class="type-toggle">
              <button
                type="button"
                :class="['type-btn', { active: form.lostFoundType === 'lost' }]"
                @click="form.lostFoundType = 'lost'"
              >
                📢 失物
              </button>
              <button
                type="button"
                :class="['type-btn', { active: form.lostFoundType === 'found' }]"
                @click="form.lostFoundType = 'found'"
              >
                📦 招领
              </button>
            </div>
          </FormField>

          <FormField label="物品名称" required :error="errors.itemName">
            <input
              v-model.trim="form.itemName"
              type="text"
              placeholder="例如：校园卡、钥匙"
              :class="{ invalid: errors.itemName }"
            />
          </FormField>

          <FormField label="丢失/拾到时间" required :error="errors.eventTime">
            <input
              v-model="form.eventTime"
              type="date"
              :max="today"
              :class="{ invalid: errors.eventTime }"
            />
          </FormField>
        </div>

        <!-- 拼单搭子 -->
        <div v-else-if="publishType === 'groupBuy'" key="groupBuy" class="section section-fields">
          <div class="section-title">🤝 拼单信息</div>

          <FormField label="拼单类型" required :error="errors.groupType">
            <select v-model="form.groupType" :class="{ invalid: errors.groupType }">
              <option value="">请选择类型</option>
              <option>外卖拼单</option>
              <option>团购</option>
              <option>拼车</option>
              <option>学习搭子</option>
              <option>运动搭子</option>
              <option>其他搭子</option>
            </select>
          </FormField>

          <FormField label="目标人数" required :error="errors.targetCount">
            <input
              v-model.number="form.targetCount"
              type="number"
              min="2"
              placeholder="至少 2 人"
              :class="{ invalid: errors.targetCount }"
            />
          </FormField>

          <FormField label="截止日期" required :error="errors.deadline">
            <input
              v-model="form.deadline"
              type="date"
              :min="today"
              :class="{ invalid: errors.deadline }"
            />
          </FormField>
        </div>

        <!-- 跑腿委托 -->
        <div v-else key="errand" class="section section-fields">
          <div class="section-title">🏃 任务信息</div>

          <FormField label="任务类型" required :error="errors.taskType">
            <input
              v-model.trim="form.taskType"
              type="text"
              placeholder="如：取快递、代买、代送"
              :class="{ invalid: errors.taskType }"
            />
          </FormField>

          <FormField label="酬劳" required :error="errors.reward">
            <input
              v-model.number="form.reward"
              type="number"
              min="0"
              placeholder="请输入酬劳"
              :class="{ invalid: errors.reward }"
            />
          </FormField>

          <FormField label="取件地点" required :error="errors.from">
            <input
              v-model.trim="form.from"
              type="text"
              placeholder="请输入取件地点"
              :class="{ invalid: errors.from }"
            />
          </FormField>

          <FormField label="送达地点" required :error="errors.to">
            <input
              v-model.trim="form.to"
              type="text"
              placeholder="请输入送达地点"
              :class="{ invalid: errors.to }"
            />
          </FormField>

          <FormField label="截止时间" required :error="errors.deadline">
            <input
              v-model="form.deadline"
              type="datetime-local"
              :min="now"
              :class="{ invalid: errors.deadline }"
            />
          </FormField>
        </div>
      </Transition>

      <!-- ── 发布须知 ── -->
      <div class="publish-notice">
        <span class="notice-icon">⚠️</span>
        <div class="notice-content">
          <strong>发布须知</strong>
          <ul>
            <li>请确保发布信息真实有效，不得发布虚假内容</li>
            <li>交易过程中请注意人身和财产安全</li>
            <li>禁止发布违禁品及违反校规校纪的内容</li>
          </ul>
        </div>
      </div>

      <!-- ── 操作按钮 ── -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="resetForm">重置</button>
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? '发布中…' : '发布' }}
        </button>
      </div>
    </form>

    <!-- 违规提示弹窗 -->
    <ViolationDialog
      :visible="showViolationDialog"
      :result="filterResult!"
      @proceed="handleProceed"
      @cancel="handleCancelPublish"
    />
  </section>
</template>

<style scoped>
.page-publish {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

/* ── 页面头部 ── */
.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* ── 表单卡片 ── */
.publish-form {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

/* ── 分区 ── */
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.section-fields {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
}

/* ── 输入框 / 下拉框 / 文本域 ── */
input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

input.invalid,
select.invalid,
textarea.invalid {
  border-color: #ef4444;
}

textarea {
  resize: vertical;
  font-family: inherit;
}

/* ── 发布类型选择 ── */
.category-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cat-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-option:hover {
  border-color: #93c5fd;
  color: #2563eb;
}

.cat-option.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.cat-icon {
  font-size: 18px;
}

.cat-name {
  font-weight: 500;
}

/* ── 失物/招领切换 ── */
.type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.type-btn {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: #93c5fd;
}

.type-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

/* ── 发布须知 ── */
.publish-notice {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  font-size: 13px;
  color: #92400e;
}

.notice-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.notice-content strong {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}

.notice-content ul {
  margin: 0;
  padding-left: 18px;
}

.notice-content li {
  margin-bottom: 3px;
  line-height: 1.5;
}

/* ── 操作按钮 ── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* ── 字段切换动画 ── */
.fields-fade-enter-active,
.fields-fade-leave-active {
  transition: opacity 0.15s ease;
}

.fields-fade-enter-from,
.fields-fade-leave-to {
  opacity: 0;
}
</style>
