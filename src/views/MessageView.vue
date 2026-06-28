<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'all' | 'unread'>('all')

interface Message {
  id: number
  title: string
  content: string
  time: string
  read: boolean
  type: 'system' | 'trade' | 'chat'
}

const messages: Message[] = [
  { id: 1, title: '系统通知', content: '欢迎加入校园轻集市！请阅读用户协议和发布须知。', time: '2026-06-28 09:00', read: true, type: 'system' },
  { id: 2, title: '二手交易提醒', content: '你发布的"二手自行车"有新的咨询消息。', time: '2026-06-28 10:30', read: false, type: 'trade' },
  { id: 3, title: '拼单进度更新', content: '你参与的"奶茶拼单"已有3人加入，还差2人成团。', time: '2026-06-27 18:15', read: false, type: 'trade' },
  { id: 4, title: '私信 — 用户"小李"', content: '你好，请问二手吉他还在吗？能不能便宜一点？', time: '2026-06-27 14:20', read: false, type: 'chat' },
  { id: 5, title: '失物招领更新', content: '你发布的"蓝色校园卡"已被失主认领。', time: '2026-06-26 16:45', read: true, type: 'trade' },
  { id: 6, title: '系统通知', content: '你的发布信息已通过审核，现已在集市列表中展示。', time: '2026-06-26 11:00', read: true, type: 'system' },
  { id: 7, title: '跑腿委托提醒', content: '你接的"代取快递"委托已确认完成，报酬已到账。', time: '2026-06-25 20:30', read: true, type: 'trade' },
]

const filteredMessages = computed(() => {
  if (activeTab.value === 'unread') return messages.filter(m => !m.read)
  return messages
})

const unreadCount = computed(() => messages.filter(m => !m.read).length)

function getTypeIcon(type: Message['type']): string {
  const map = { system: '📢', trade: '📦', chat: '💬' }
  return map[type]
}
</script>

<template>
  <section class="page-message">
    <div class="page-header">
      <h2>📬 消息</h2>
      <p v-if="unreadCount > 0">{{ unreadCount }} 条未读消息</p>
      <p v-else>所有消息已读</p>
    </div>

    <!-- 筛选 -->
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
      >
        <span class="msg-icon">{{ getTypeIcon(msg.type) }}</span>
        <div class="msg-body">
          <div class="msg-header">
            <h3 class="msg-title">{{ msg.title }}</h3>
            <span v-if="!msg.read" class="unread-dot"></span>
          </div>
          <p class="msg-content">{{ msg.content }}</p>
          <span class="msg-time">{{ msg.time }}</span>
        </div>
      </div>
      <p v-if="!filteredMessages.length" class="empty-tip">暂无消息</p>
    </div>
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
  transition: box-shadow 0.2s;
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

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
}
</style>
