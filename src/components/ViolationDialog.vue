<script setup lang="ts">
/**
 * 违规提示弹窗
 *
 * - 当存在 block 级别违规时：只显示"返回修改"按钮
 * - 当仅有 warning 级别时：显示"返回修改"和"仍然发布"两个按钮
 */
import type { FilterResult, Violation } from '../utils/contentFilter'
import { getFieldLabel } from '../utils/contentFilter'

const props = defineProps<{
  /** 检测结果 */
  result: FilterResult
  /** 是否显示弹窗 */
  visible: boolean
}>()

const emit = defineEmits<{
  /** 用户点击"仍然发布" */
  proceed: []
  /** 用户点击"返回修改"或关闭 */
  cancel: []
}>()

/** 按严重程度排序违规列表 */
function sortedViolations(violations: Violation[]): Violation[] {
  return [...violations].sort((a, b) => {
    if (a.severity === 'block' && b.severity !== 'block') return -1
    if (a.severity !== 'block' && b.severity === 'block') return 1
    return 0
  })
}

/** 获取严重程度标签 */
function severityLabel(severity: string): string {
  return severity === 'block' ? '违规' : '提示'
}

/** 获取严重程度样式类 */
function severityClass(severity: string): string {
  return severity === 'block' ? 'severity-block' : 'severity-warning'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
        <div class="modal-card">
          <!-- 头部 -->
          <div class="modal-header" :class="props.result.passed ? 'header-warning' : 'header-block'">
            <span class="header-icon">
              {{ props.result.passed ? '⚠️' : '🚫' }}
            </span>
            <div>
              <h3 class="header-title">
                {{ props.result.passed ? '内容提示' : '内容违规' }}
              </h3>
              <p class="header-sub">
                {{
                  props.result.passed
                    ? '以下内容可能存在风险，请确认是否继续发布'
                    : '以下内容包含违规信息，请修改后重新发布'
                }}
              </p>
            </div>
          </div>

          <!-- 违规列表 -->
          <div class="modal-body">
            <div
              v-for="field in props.result.fields"
              :key="field.field"
              class="field-group"
            >
              <div class="field-label">📌 {{ getFieldLabel(field.field) }}</div>
              <ul class="violation-list">
                <li
                  v-for="(v, idx) in sortedViolations(field.violations)"
                  :key="idx"
                  :class="['violation-item', severityClass(v.severity)]"
                >
                  <span class="violation-tag">{{ severityLabel(v.severity) }}</span>
                  <span class="violation-word">"{{ v.word }}"</span>
                  <span class="violation-reason">{{ v.reason }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="modal-footer">
            <template v-if="!props.result.passed">
              <!-- 有 block 级别违规：只能返回修改 -->
              <button class="btn btn-cancel" @click="emit('cancel')">
                返回修改
              </button>
            </template>
            <template v-else>
              <!-- 仅有 warning：可选择继续发布 -->
              <button class="btn btn-cancel" @click="emit('cancel')">
                返回修改
              </button>
              <button class="btn btn-proceed" @click="emit('proceed')">
                仍然发布
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── 遮罩层 ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 16px;
}

/* ── 弹窗卡片 ── */
.modal-card {
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* ── 头部 ── */
.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px;
}

.header-block {
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
}

.header-warning {
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
}

.header-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.header-title {
  margin: 0 0 4px;
  font-size: 17px;
  color: #1f2937;
}

.header-sub {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

/* ── 主体 ── */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.field-group {
  margin-bottom: 16px;
}

.field-group:last-child {
  margin-bottom: 0;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.violation-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.violation-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.severity-block {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.severity-warning {
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.violation-tag {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.severity-block .violation-tag {
  background: #ef4444;
  color: #fff;
}

.severity-warning .violation-tag {
  background: #f59e0b;
  color: #fff;
}

.violation-word {
  flex-shrink: 0;
  font-weight: 600;
  color: #1f2937;
}

.violation-reason {
  color: #6b7280;
}

/* ── 底部按钮 ── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f3f4f6;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-proceed {
  background: #f59e0b;
  color: #fff;
}

.btn-proceed:hover {
  background: #d97706;
}

/* ── 过渡动画 ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to .modal-card {
  transform: scale(0.95) translateY(10px);
}
</style>
