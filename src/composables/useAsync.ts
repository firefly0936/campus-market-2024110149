import { ref, type Ref } from 'vue'

/**
 * 通用异步状态管理 — 统一管理 loading / error / data 三种状态
 */
export function useAsync<T>(asyncFn: () => Promise<T>): {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  execute: () => Promise<void>
} {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await asyncFn()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '请求失败，请检查网络或稍后重试'
      error.value = msg
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
