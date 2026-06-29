import http from './http'

export interface SecondHandItem {
  id: number
  title: string
  description: string
  price: number
  images: string[]
  category: string
  condition: string
  tradeLocation: string
  contact: string
  status: string
  sellerId: number
  createdAt: string
}

export function getSecondHandList() {
  return http.get<SecondHandItem[]>('/secondHand')
}

export function getSecondHandDetail(id: number) {
  return http.get<SecondHandItem>(`/secondHand/${id}`)
}

export function createSecondHand(data: Partial<SecondHandItem>) {
  return http.post<SecondHandItem>('/secondHand', data)
}

export function updateSecondHand(id: number, data: Partial<SecondHandItem>) {
  return http.put<SecondHandItem>(`/secondHand/${id}`, data)
}

export function deleteSecondHand(id: number) {
  return http.delete(`/secondHand/${id}`)
}
