<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAsync } from '@/composables/useAsync'
import { getMessages, markAsRead, type MessageItem } from '@/api/message'
import EmptyState from '@/components/EmptyState.vue'

const activeTab = ref<'all' | 'unread'>('all')
const messages = ref<MessageItem[]>([])

const { loading, error, execute } = useAsync(async () => {
  const res = await getMessages()
  messages.value = res.data
})

onMounted(() => execute())

const filteredMessages = computed(() => {
  if (activeTab.value === 'unread') return messages.value.filter((m) => !m.read)
  return messages.value
})

const unreadCount = computed(() => messages.value.filter((m) => !m.read).length)

/** 消息类型映射 */
function getTypeInfo(msg: MessageItem): { icon: string; label: string } {
  if (msg.relatedType === 'system' || msg.fromId === 0)
    return { icon: '📢', label: '系统通知' }
  if (msg.relatedType === 'secondHand' || msg.relatedType === 'errand')
    return { icon: '📦', label: '交易消息' }
  if (msg.relatedType === 'groupBuy')
    return { icon: '🤝', label: '拼单消息' }
  if (msg.relatedType === 'lostAndFound')
    return { icon: '🔍', label: '失物消息' }
  return { icon: '💬', label: '聊天消息' }
}

/** 点击消息 — 标记已读 */
async function handleClick(msg: MessageItem) {
  if (!msg.read) {
    try {
      await markAsRead(msg.id)
      msg.read = true
    } catch {
      // 静默失败，UI 仍可交互
    }
  }
}
</script>

<template>
  <section class="page-message">
    <div class="page-header">
      <h2>📬 消息</h2>
      <p v-if="unreadCount > 0">{{ unreadCount }} 条未读消息</p>
      <p v-else>所有消息已读</p>
    </div>

    <!-- loading -->
    <p v-if="loading" class="state-text">加载中…</p>

    <!-- error -->
    <div v-else-if="error" class="error-box">
      <p>⚠️ {{ error }}</p>
      <button class="retry-btn" @click="execute()">重试</button>
    </div>

    <!-- empty -->
    <EmptyState v-else-if="messages.length === 0" text="暂无消息" />

    <!-- 正常 -->
    <template v-else>
      <!-- 筛选 Tab -->
      <nav class="tab-nav">
        <button
          :class="['tab-btn', { active: activeTab === 'all' }]"
          @click="activeTab = 'all'"
        >
          全部消息
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'unread' }]"
          @click="activeTab = 'unread'"
        >
          未读消息
          <span v-if="unreadCount" class="badge">{{ unreadCount }}</span>
        </button>
      </nav>

      <!-- 消息列表 -->
      <div class="message-list">
        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          :class="['message-card', { unread: !msg.read }]"
          @click="handleClick(msg)"
        >
          <span class="msg-icon">{{ getTypeInfo(msg).icon }}</span>
          <div class="msg-body">
            <div class="msg-header">
              <h3 class="msg-title">{{ getTypeInfo(msg).label }}</h3>
              <span v-if="!msg.read" class="unread-dot"></span>
            </div>
            <p class="msg-content">{{ msg.content }}</p>
            <span class="msg-time">{{ msg.createdAt }}</span>
          </div>
        </div>
        <EmptyState
          v-if="filteredMessages.length === 0"
          text="暂无未读消息"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.page-message {
  padding: 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}
.page-header h2 {
  color: #333;
  font-size: 22px;
  margin: 0 0 8px;
}
.page-header p {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.state-text {
  text-align: center;
  color: #999;
  padding: 32px 0;
}
.error-box {
  text-align: center;
  padding: 32px;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
}
.error-box p {
  color: #dc2626;
  margin-bottom: 12px;
}
.retry-btn {
  padding: 8px 24px;
  border: 1px solid #409eff;
  background: #fff;
  color: #409eff;
  border-radius: 6px;
  cursor: pointer;
}
.retry-btn:hover {
  background: #409eff;
  color: #fff;
}

.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  background: #fff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.tab-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #f56c6c;
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.message-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
}
.message-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.message-card.unread {
  background: #f0f7ff;
  border-color: #c6e2ff;
}
.msg-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}
.msg-body {
  flex: 1;
  min-width: 0;
}
.msg-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.msg-title {
  margin: 0;
  font-size: 15px;
  color: #303133;
}
.unread-dot {
  width: 8px;
  height: 8px;
  background: #409eff;
  border-radius: 50%;
  flex-shrink: 0;
}
.msg-content {
  margin: 0 0 6px;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msg-time {
  font-size: 12px;
  color: #999;
}
</style>
