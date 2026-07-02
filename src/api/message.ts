import http from './http'

export interface MessageItem {
  id: number
  fromId: number
  toId: number
  content: string
  relatedType: string
  relatedId: number
  read: boolean
  createdAt: string
}

export function getMessages() {
  return http.get<MessageItem[]>('/messages')
}

export function markAsRead(id: number) {
  return http.patch<MessageItem>(`/messages/${id}`, { read: true })
}
