import http from './http'

export interface GroupBuyItem {
  id: number
  title: string
  description: string
  groupType: string
  targetCount: number
  currentCount: number
  deadline: string
  meetingLocation: string
  contact: string
  status: string
  creatorId: number
  createdAt: string
}

export function getGroupBuyList() {
  return http.get<GroupBuyItem[]>('/groupBuy')
}

export function getGroupBuyDetail(id: number) {
  return http.get<GroupBuyItem>(`/groupBuy/${id}`)
}

export function createGroupBuy(data: Partial<GroupBuyItem>) {
  return http.post<GroupBuyItem>('/groupBuy', data)
}

export function updateGroupBuy(id: number, data: Partial<GroupBuyItem>) {
  return http.put<GroupBuyItem>(`/groupBuy/${id}`, data)
}

export function deleteGroupBuy(id: number) {
  return http.delete(`/groupBuy/${id}`)
}
