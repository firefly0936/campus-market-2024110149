<script setup lang="ts">
defineProps<{
  title: string
  status?: string
  statusClass?: string
  tag?: string
  tagClass?: string
}>()
</script>

<template>
  <div class="item-card">
    <!-- 头部：标题 + 状态/标签 -->
    <div class="item-card__header">
      <h3>{{ title }}</h3>
      <div class="item-card__badges">
        <span v-if="status" :class="['tag', 'tag--status', statusClass]">
          {{ status }}
        </span>
        <span v-if="tag" :class="['tag', 'tag--type', tagClass]">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 描述区域（插槽） -->
    <div v-if="$slots.description" class="description">
      <slot name="description" />
    </div>

    <!-- 元信息区域（插槽） -->
    <div v-if="$slots.meta" class="meta">
      <slot name="meta" />
    </div>

    <!-- 自定义内容（默认插槽） -->
    <slot />

    <!-- 底部操作区（插槽） -->
    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.item-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.item-card__badges {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.item-card h3 {
  margin: 0;
  font-size: 18px;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.tag--status {
  background: #eff6ff;
  color: #2563eb;
}

.tag--type {
  background: #f0f2f5;
  color: #909399;
}

.description {
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 16px;
  color: #6b7280;
  font-size: 13px;
}

.footer {
  margin-top: 12px;
}
</style>
