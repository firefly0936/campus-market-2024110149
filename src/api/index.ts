import axios from 'axios'

// JSON Server backend API base URL
const API_BASE = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
})

// 二手交易
export const secondHandApi = {
  list: () => api.get('/secondHand'),
  detail: (id: number) => api.get(`/secondHand/${id}`),
  create: (data: unknown) => api.post('/secondHand', data),
  update: (id: number, data: unknown) => api.put(`/secondHand/${id}`, data),
  remove: (id: number) => api.delete(`/secondHand/${id}`),
}

// 失物招领
export const lostAndFoundApi = {
  list: () => api.get('/lostAndFound'),
  detail: (id: number) => api.get(`/lostAndFound/${id}`),
  create: (data: unknown) => api.post('/lostAndFound', data),
  update: (id: number, data: unknown) => api.put(`/lostAndFound/${id}`, data),
  remove: (id: number) => api.delete(`/lostAndFound/${id}`),
}

// 拼单搭子
export const groupBuyApi = {
  list: () => api.get('/groupBuy'),
  detail: (id: number) => api.get(`/groupBuy/${id}`),
  create: (data: unknown) => api.post('/groupBuy', data),
  update: (id: number, data: unknown) => api.put(`/groupBuy/${id}`, data),
  remove: (id: number) => api.delete(`/groupBuy/${id}`),
}

// 跑腿委托
export const errandApi = {
  list: () => api.get('/errand'),
  detail: (id: number) => api.get(`/errand/${id}`),
  create: (data: unknown) => api.post('/errand', data),
  update: (id: number, data: unknown) => api.put(`/errand/${id}`, data),
  remove: (id: number) => api.delete(`/errand/${id}`),
}

// 消息
export const messageApi = {
  list: () => api.get('/messages'),
  create: (data: unknown) => api.post('/messages', data),
}

// 用户
export const userApi = {
  get: (id: number) => api.get(`/users/${id}`),
  create: (data: unknown) => api.post('/users', data),
  update: (id: number, data: unknown) => api.put(`/users/${id}`, data),
}

export default api
