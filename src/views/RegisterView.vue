<template>
  <section class="auth-page">
    <div class="auth-card">
      <h1>注册校园轻集市账号</h1>
      <p class="desc">创建账号后，可以发布信息、收藏内容并进入个人中心。</p>

      <form class="auth-form" @submit.prevent="handleRegister">
        <FormField label="用户名" required :error="errors.username">
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
        </FormField>

        <FormField label="密码" required :error="errors.password">
          <input v-model="form.password" type="password" placeholder="请输入密码（至少 6 位）" />
        </FormField>

        <FormField label="确认密码" required :error="errors.confirmPassword">
          <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
        </FormField>

        <FormField label="显示名称" required :error="errors.name">
          <input v-model.trim="form.name" type="text" placeholder="例如：计算机学院小明" />
        </FormField>

        <FormField label="学院" required :error="errors.college">
          <input v-model.trim="form.college" type="text" placeholder="例如：计算机学院" />
        </FormField>

        <FormField label="年级" required :error="errors.grade">
          <select v-model="form.grade">
            <option value="">请选择年级</option>
            <option>2026级</option>
            <option>2025级</option>
            <option>2024级</option>
            <option>2023级</option>
            <option>2022级</option>
            <option>2021级</option>
          </select>
        </FormField>

        <div v-if="submitError" class="submit-error">{{ submitError }}</div>

        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="switch-link">
        已有账号？<RouterLink to="/login">去登录</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '../components/FormField.vue'
import { getUserByUsername, createUser } from '../api/user'

const router = useRouter()
const submitting = ref(false)
const submitError = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  college: '',
  grade: '',
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.username.trim()) errors.username = '请填写用户名'
  else if (form.username.trim().length < 3) errors.username = '用户名至少 3 个字符'

  if (!form.password) errors.password = '请填写密码'
  else if (form.password.length < 6) errors.password = '密码至少 6 位'

  if (!form.confirmPassword) errors.confirmPassword = '请确认密码'
  else if (form.password !== form.confirmPassword) errors.confirmPassword = '两次输入的密码不一致'

  if (!form.name.trim()) errors.name = '请填写显示名称'
  if (!form.college.trim()) errors.college = '请填写学院'
  if (!form.grade) errors.grade = '请选择年级'

  return Object.keys(errors).length === 0
}

async function handleRegister() {
  submitError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    // 检查用户名是否已存在
    const res = await getUserByUsername(form.username.trim())
    if (res.data.length > 0) {
      submitError.value = '该用户名已被注册，请换一个'
      return
    }

    // 创建用户
    await createUser({
      username: form.username.trim(),
      password: form.password,
      name: form.name.trim(),
      college: form.college.trim(),
      grade: form.grade,
      avatar: '',
      bio: '',
    })

    window.alert('注册成功！请登录。')
    router.push('/login')
  } catch {
    submitError.value = '注册失败，请确认 JSON Server 已启动。'
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

input,
select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
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
</style>
