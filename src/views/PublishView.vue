<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { secondHandApi, lostAndFoundApi, groupBuyApi, errandApi } from '@/api'

type Category = 'secondHand' | 'lostAndFound' | 'groupBuy' | 'errand'

const categories: { key: Category; name: string; icon: string }[] = [
  { key: 'secondHand', name: '二手交易', icon: '🛒' },
  { key: 'lostAndFound', name: '失物招领', icon: '🔍' },
  { key: 'groupBuy', name: '拼单搭子', icon: '🤝' },
  { key: 'errand', name: '跑腿委托', icon: '🏃' },
]

const form = reactive({
  category: 'secondHand' as Category,
  title: '',
  image: '',
  description: '',
  contact: '',
  // 二手交易
  price: null as number | null,
  condition: '九成新' as string,
  tradeLocation: '' as string,
  // 失物招领
  lostType: '失物' as string,
  location: '' as string,
  lostDate: '' as string,
  // 拼单搭子
  targetCount: null as number | null,
  deadline: '' as string,
  meetingLocation: '' as string,
  // 跑腿委托
  reward: null as number | null,
  pickupLocation: '' as string,
  deliveryLocation: '' as string,
  expectedTime: '' as string,
})

const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')
const draftSaved = ref(false)

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.title.trim()) errors.title = '请填写物品名称'
  if (!form.description.trim()) errors.description = '请填写详细介绍'
  if (!form.contact.trim()) errors.contact = '请填写联系方式'

  if (form.category === 'secondHand') {
    if (form.price === null || form.price < 0) errors.price = '请填写有效价格'
    if (!form.tradeLocation.trim()) errors.tradeLocation = '请填写交易地点'
  }
  if (form.category === 'lostAndFound') {
    if (!form.location.trim()) errors.location = '请填写地点'
    if (!form.lostDate) errors.lostDate = '请选择丢失/拾到时间'
  }
  if (form.category === 'groupBuy') {
    if (form.targetCount === null || form.targetCount < 2) errors.targetCount = '拼单人数至少2人'
    if (!form.deadline) errors.deadline = '请选择截止日期'
    if (!form.meetingLocation.trim()) errors.meetingLocation = '请填写集合地点'
  }
  if (form.category === 'errand') {
    if (form.reward === null || form.reward < 0) errors.reward = '请填写有效报酬'
    if (!form.pickupLocation.trim()) errors.pickupLocation = '请填写取件地点'
    if (!form.deliveryLocation.trim()) errors.deliveryLocation = '请填写送达地点'
    if (!form.expectedTime) errors.expectedTime = '请选择期望完成时间'
  }

  return Object.keys(errors).length === 0
}

function buildPayload() {
  const base = {
    title: form.title.trim(),
    description: form.description.trim(),
    images: form.image.trim() ? [form.image.trim()] : [],
    contact: form.contact.trim(),
    publisherId: 1,
    createdAt: new Date().toISOString(),
  }
  switch (form.category) {
    case 'secondHand':
      return { ...base, price: form.price ?? 0, condition: form.condition, tradeLocation: form.tradeLocation.trim(), status: '在售', sellerId: 1 }
    case 'lostAndFound':
      return { ...base, type: form.lostType, location: form.location.trim(), lostDate: form.lostDate, status: '未解决' }
    case 'groupBuy':
      return { ...base, targetCount: form.targetCount ?? 2, currentCount: 0, deadline: form.deadline, meetingLocation: form.meetingLocation.trim(), status: '进行中', creatorId: 1 }
    case 'errand':
      return { ...base, reward: form.reward ?? 0, pickupLocation: form.pickupLocation.trim(), deliveryLocation: form.deliveryLocation.trim(), expectedTime: form.expectedTime, status: '待接单' }
  }
}

async function handleSubmit() {
  errorMsg.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    const payload = buildPayload()
    const apiMap = {
      secondHand: secondHandApi,
      lostAndFound: lostAndFoundApi,
      groupBuy: groupBuyApi,
      errand: errandApi,
    }
    await apiMap[form.category].create(payload)
    clearDraft()
    submitted.value = true
  } catch {
    errorMsg.value = '后端未启动，但表单数据已准备好（可稍后重试）'
  } finally {
    submitting.value = false
  }
}

// ── 草稿 ──
const DRAFT_KEY = 'publish_draft'

function saveDraft() {
  const data = { ...form }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  draftSaved.value = true
  setTimeout(() => { draftSaved.value = false }, 2000)
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    Object.keys(data).forEach(k => {
      if (k in form) (form as Record<string, unknown>)[k] = data[k]
    })
  } catch {
    // ignore corrupt draft
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

onMounted(() => {
  loadDraft()
})

function resetForm() {
  form.title = ''
  form.image = ''
  form.description = ''
  form.contact = ''
  form.price = null
  form.condition = '九成新'
  form.tradeLocation = ''
  form.lostType = '失物'
  form.location = ''
  form.lostDate = ''
  form.targetCount = null
  form.deadline = ''
  form.meetingLocation = ''
  form.reward = null
  form.pickupLocation = ''
  form.deliveryLocation = ''
  form.expectedTime = ''
  submitted.value = false
  errorMsg.value = ''
  Object.keys(errors).forEach(k => delete errors[k])
}

const today = computed(() => new Date().toISOString().slice(0, 10))
const now = computed(() => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
})
</script>

<template>
  <section class="page-publish">
    <h2>发布信息</h2>
    <p>填写你要发布的集市信息。</p>

    <form v-if="!submitted" class="publish-form" @submit.prevent="handleSubmit">
      <!-- 分类选择 -->
      <label class="form-label">分类</label>
      <div class="category-picker">
        <button
          v-for="cat in categories"
          :key="cat.key"
          type="button"
          :class="['cat-option', { active: form.category === cat.key }]"
          @click="form.category = cat.key"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- 物品名称 -->
      <label class="form-label" for="title">物品名称</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="form-input"
        :class="{ invalid: errors.title }"
        placeholder="例如：二手自行车 — 9成新"
      />
      <span v-if="errors.title" class="form-error">{{ errors.title }}</span>

      <!-- 图片上传 -->
      <label class="form-label">图片上传</label>
      <div class="upload-area" :class="{ 'has-image': form.image }">
        <template v-if="!form.image">
          <span class="upload-icon">📷</span>
          <span class="upload-hint">点击下方输入图片链接</span>
          <span class="upload-accept">支持 jpg、png 等格式</span>
        </template>
        <div v-else class="image-preview">
          <img :src="form.image" alt="预览" @error="(e) => (e.target as HTMLImageElement).style.display = 'none'" />
        </div>
      </div>
      <input
        id="image"
        v-model="form.image"
        type="url"
        class="form-input"
        placeholder="https://example.com/image.jpg"
      />

      <!-- 详细介绍 -->
      <label class="form-label" for="desc">详细介绍</label>
      <textarea
        id="desc"
        v-model="form.description"
        class="form-textarea"
        :class="{ invalid: errors.description }"
        rows="4"
        placeholder="描述物品的详细情况…"
      ></textarea>
      <span v-if="errors.description" class="form-error">{{ errors.description }}</span>

      <!-- 联系方式（通用） -->
      <label class="form-label" for="contact">联系方式</label>
      <input
        id="contact"
        v-model="form.contact"
        type="text"
        class="form-input"
        :class="{ invalid: errors.contact }"
        placeholder="手机号 / 微信号"
      />
      <span v-if="errors.contact" class="form-error">{{ errors.contact }}</span>

      <!-- ═══════ 二手交易专属 ═══════ -->
      <template v-if="form.category === 'secondHand'">
        <label class="form-label" for="price">价格 (¥)</label>
        <input
          id="price"
          v-model.number="form.price"
          type="number"
          class="form-input"
          :class="{ invalid: errors.price }"
          placeholder="0 表示免费"
          min="0"
        />
        <span v-if="errors.price" class="form-error">{{ errors.price }}</span>

        <label class="form-label" for="condition">成色</label>
        <select id="condition" v-model="form.condition" class="form-input">
          <option>全新</option>
          <option>九成新</option>
          <option>八成新</option>
          <option>七成新及以下</option>
        </select>

        <label class="form-label" for="tradeLocation">交易地点</label>
        <input
          id="tradeLocation"
          v-model="form.tradeLocation"
          type="text"
          class="form-input"
          :class="{ invalid: errors.tradeLocation }"
          placeholder="例如：食堂门口 / 2号教学楼"
        />
        <span v-if="errors.tradeLocation" class="form-error">{{ errors.tradeLocation }}</span>
      </template>

      <!-- ═══════ 失物招领专属 ═══════ -->
      <template v-if="form.category === 'lostAndFound'">
        <label class="form-label">类型</label>
        <div class="type-toggle">
          <button
            type="button"
            :class="['type-btn', { active: form.lostType === '失物' }]"
            @click="form.lostType = '失物'"
          >
            失物
          </button>
          <button
            type="button"
            :class="['type-btn', { active: form.lostType === '招领' }]"
            @click="form.lostType = '招领'"
          >
            招领
          </button>
        </div>

        <label class="form-label" for="lostDate">丢失/拾到时间</label>
        <input
          id="lostDate"
          v-model="form.lostDate"
          type="date"
          class="form-input"
          :class="{ invalid: errors.lostDate }"
          :max="today"
        />
        <span v-if="errors.lostDate" class="form-error">{{ errors.lostDate }}</span>

        <label class="form-label" for="location">地点</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          class="form-input"
          :class="{ invalid: errors.location }"
          placeholder="例如：图书馆二楼"
        />
        <span v-if="errors.location" class="form-error">{{ errors.location }}</span>
      </template>

      <!-- ═══════ 拼单搭子专属 ═══════ -->
      <template v-if="form.category === 'groupBuy'">
        <label class="form-label" for="targetCount">目标人数</label>
        <input
          id="targetCount"
          v-model.number="form.targetCount"
          type="number"
          class="form-input"
          :class="{ invalid: errors.targetCount }"
          placeholder="至少 2 人"
          min="2"
        />
        <span v-if="errors.targetCount" class="form-error">{{ errors.targetCount }}</span>

        <label class="form-label" for="deadline">截止日期</label>
        <input
          id="deadline"
          v-model="form.deadline"
          type="date"
          class="form-input"
          :class="{ invalid: errors.deadline }"
          :min="today"
        />
        <span v-if="errors.deadline" class="form-error">{{ errors.deadline }}</span>

        <label class="form-label" for="meetingLocation">集合地点</label>
        <input
          id="meetingLocation"
          v-model="form.meetingLocation"
          type="text"
          class="form-input"
          :class="{ invalid: errors.meetingLocation }"
          placeholder="例如：南门 / 图书馆门前"
        />
        <span v-if="errors.meetingLocation" class="form-error">{{ errors.meetingLocation }}</span>
      </template>

      <!-- ═══════ 跑腿委托专属 ═══════ -->
      <template v-if="form.category === 'errand'">
        <label class="form-label" for="reward">报酬 (¥)</label>
        <input
          id="reward"
          v-model.number="form.reward"
          type="number"
          class="form-input"
          :class="{ invalid: errors.reward }"
          placeholder="0 表示免费帮忙"
          min="0"
        />
        <span v-if="errors.reward" class="form-error">{{ errors.reward }}</span>

        <label class="form-label" for="pickup">取件地点</label>
        <input
          id="pickup"
          v-model="form.pickupLocation"
          type="text"
          class="form-input"
          :class="{ invalid: errors.pickupLocation }"
          placeholder="例如：北门驿站"
        />
        <span v-if="errors.pickupLocation" class="form-error">{{ errors.pickupLocation }}</span>

        <label class="form-label" for="delivery">送达地点</label>
        <input
          id="delivery"
          v-model="form.deliveryLocation"
          type="text"
          class="form-input"
          :class="{ invalid: errors.deliveryLocation }"
          placeholder="例如：3号宿舍楼"
        />
        <span v-if="errors.deliveryLocation" class="form-error">{{ errors.deliveryLocation }}</span>

        <label class="form-label" for="expectedTime">期望完成时间</label>
        <input
          id="expectedTime"
          v-model="form.expectedTime"
          type="datetime-local"
          class="form-input"
          :class="{ invalid: errors.expectedTime }"
          :min="now"
        />
        <span v-if="errors.expectedTime" class="form-error">{{ errors.expectedTime }}</span>
      </template>

      <!-- 发布须知 -->
      <div class="publish-notice">
        <span class="notice-icon">⚠️</span>
        <div class="notice-content">
          <strong>发布须知</strong>
          <ul>
            <li>请确保发布信息真实有效，不得发布虚假内容</li>
            <li>交易过程中请注意人身和财产安全</li>
            <li>禁止发布违禁品及违反校规校纪的内容</li>
            <li>发布即表示同意遵守校园轻集市的用户协议</li>
          </ul>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <button type="button" class="draft-btn" @click="saveDraft">
          💾 保存草稿
        </button>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? '发布中…' : '发布信息' }}
        </button>
      </div>

      <p v-if="draftSaved" class="draft-toast">✅ 草稿已保存</p>
      <p v-if="errorMsg" class="form-error" style="text-align:center;margin-top:12px">{{ errorMsg }}</p>
    </form>

    <!-- 发布成功 -->
    <div v-else class="success-card">
      <span class="success-icon">✅</span>
      <h3>发布成功！</h3>
      <p>你的信息已提交到 {{ categories.find(c => c.key === form.category)?.name }} 分类。</p>
      <button class="submit-btn" @click="resetForm">继续发布</button>
    </div>
  </section>
</template>

<style scoped>
.page-publish {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-top: 12px;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  color: #303133;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}

.form-input.invalid,
.form-textarea.invalid {
  border-color: #f56c6c;
}

.form-error {
  color: #f56c6c;
  font-size: 12px;
}

/* ── 分类选择 ── */
.category-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-option {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-option:hover {
  border-color: #409eff;
  color: #409eff;
}

.cat-option.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

/* ── 失物/招领切换 ── */
.type-toggle {
  display: flex;
  gap: 8px;
}

.type-btn {
  padding: 8px 24px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

/* ── 图片上传区域 ── */
.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #fafafa;
  transition: border-color 0.2s, background 0.2s;
}

.upload-area:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-icon {
  font-size: 36px;
}

.upload-hint {
  font-size: 14px;
  color: #606266;
}

.upload-accept {
  font-size: 12px;
  color: #909399;
}

.upload-area.has-image {
  padding: 8px;
}

.image-preview {
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
}

.image-preview img {
  width: 100%;
  max-height: 240px;
  display: block;
  object-fit: cover;
}

/* ── 发布须知 ── */
.publish-notice {
  display: flex;
  gap: 10px;
  margin-top: 24px;
  padding: 14px 16px;
  background: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 8px;
  font-size: 13px;
  color: #8a6d3b;
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
  gap: 12px;
  margin-top: 24px;
}

.draft-btn,
.submit-btn {
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
}

.draft-btn {
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
}

.draft-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.submit-btn {
  border: none;
  background: #409eff;
  color: #fff;
}

.submit-btn:hover {
  opacity: 0.85;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.draft-toast {
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #67c23a;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}

/* ── 成功状态 ── */
.success-card {
  text-align: center;
  padding: 48px 24px;
  margin-top: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  background: #f9f9f9;
}

.success-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.success-card h3 {
  margin: 0 0 8px;
  color: #67c23a;
}

.success-card p {
  color: #666;
  margin-bottom: 20px;
}
</style>
