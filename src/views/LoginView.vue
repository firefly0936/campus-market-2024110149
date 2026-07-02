<template>
  <section class="auth-page">
    <div class="auth-card">
      <h1>登录校园轻集市</h1>
      <p class="desc">登录后可以发布信息、收藏内容和查看个人中心。</p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <FormField label="用户名" required :error="errors.username">
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
        </FormField>

        <FormField label="密码" required :error="errors.password">
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </FormField>

        <div v-if="submitError" class="submit-error">{{ submitError }}</div>

        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="switch-link">
        还没有账号？<RouterLink to="/register">去注册</RouterLink>
      </p>

      <div class="test-hint">
        <p><strong>测试账号</strong></p>
        <p>用户名：student / 密码：123456</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '../components/FormField.vue'
import { getUsers, type User } from '../api/user'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const submitting = ref(false)
const submitError = ref('')

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.username.trim()) errors.username = '请填写用户名'
  if (!form.password) errors.password = '请填写密码'
  return Object.keys(errors).length === 0
}

async function handleLogin() {
  submitError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    const res = await getUsers()
    const users: User[] = res.data
    const matched = users.find(
      (u) => u.username === form.username.trim() && u.password === form.password,
    )

    if (!matched) {
      submitError.value = '用户名或密码错误'
      return
    }

    userStore.setLogin({
      id: matched.id,
      username: matched.username,
      name: matched.name,
      college: matched.college,
      grade: matched.grade,
      avatar: matched.avatar,
      bio: matched.bio,
    })

    router.push('/')
  } catch {
    submitError.value = '登录失败，请确认 JSON Server 已启动。'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border-radius: 16px;
  background: #fff;
}

.auth-card h1 {
  margin: 0 0 8px;
  font-size: 22px;
}

.desc {
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 14px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.submit-error {
  padding: 10px 14px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 13px;
}

.btn-primary {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 12px;
  background: #2563eb;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.switch-link {
  margin: 20px 0 0;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.switch-link a {
  color: #2563eb;
  text-decoration: none;
}

.test-hint {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  font-size: 13px;
  color: #0369a1;
}

.test-hint p {
  margin: 0 0 4px;
}

.test-hint p:last-child {
  margin: 0;
}
</style>
