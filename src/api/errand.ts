import http from './http'

export interface ErrandItem {
  id: number
  title: string
  description: string
  taskType: string
  reward: number
  pickupLocation: string
  deliveryLocation: string
  expectedTime: string
  contact: string
  status: string
  publisherId: number
  createdAt: string
}

export function getErrandList() {
  return http.get<ErrandItem[]>('/errand')
}

export function getErrandDetail(id: number) {
  return http.get<ErrandItem>(`/errand/${id}`)
}

export function createErrand(data: Partial<ErrandItem>) {
  return http.post<ErrandItem>('/errand', data)
}

export function updateErrand(id: number, data: Partial<ErrandItem>) {
  return http.put<ErrandItem>(`/errand/${id}`, data)
}

export function deleteErrand(id: number) {
  return http.delete(`/errand/${id}`)
}
