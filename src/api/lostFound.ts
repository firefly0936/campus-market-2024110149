import http from './http'

export interface LostFoundItem {
  id: number
  title: string
  description: string
  type: string
  location: string
  lostDate: string
  contact: string
  status: string
  publisherId: number
  createdAt: string
}

export function getLostFoundList() {
  return http.get<LostFoundItem[]>('/lostAndFound')
}

export function getLostFoundDetail(id: number) {
  return http.get<LostFoundItem>(`/lostAndFound/${id}`)
}

export function createLostFound(data: Partial<LostFoundItem>) {
  return http.post<LostFoundItem>('/lostAndFound', data)
}

export function updateLostFound(id: number, data: Partial<LostFoundItem>) {
  return http.put<LostFoundItem>(`/lostAndFound/${id}`, data)
}

export function deleteLostFound(id: number) {
  return http.delete(`/lostAndFound/${id}`)
}
