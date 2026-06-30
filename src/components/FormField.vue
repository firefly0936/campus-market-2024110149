<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  error?: string
}>()
</script>

<template>
  <label class="form-field">
    <span class="form-field-label">
      {{ label }}
      <span v-if="required" class="form-field-required">*</span>
    </span>
    <slot />
    <span v-if="error" class="form-field-error">{{ error }}</span>
  </label>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-field-required {
  color: #f56c6c;
  margin-left: 2px;
}

.form-field-error {
  color: #f56c6c;
  font-size: 12px;
}

.form-field :deep(input),
.form-field :deep(textarea),
.form-field :deep(select) {
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

.form-field :deep(input:focus),
.form-field :deep(textarea:focus),
.form-field :deep(select:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}

.form-field :deep(input.invalid),
.form-field :deep(textarea.invalid),
.form-field :deep(select.invalid) {
  border-color: #f56c6c;
}
</style>
