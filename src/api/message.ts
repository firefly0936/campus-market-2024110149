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

/** 获取全部消息 */
export function getMessages() {
  return http.get<MessageItem[]>('/messages')
}

/** 获取单条消息 */
export function getMessageDetail(id: number) {
  return http.get<MessageItem>(`/messages/${id}`)
}

/** 创建消息 */
export function createMessage(data: Partial<MessageItem>) {
  return http.post<MessageItem>('/messages', data)
}

/** 标记为已读 */
export function markAsRead(id: number) {
  return http.patch<MessageItem>(`/messages/${id}`, { read: true })
}

/** 获取未读消息数量 */
export async function getUnreadCount(): Promise<number> {
  const res = await http.get<MessageItem[]>('/messages?read=false')
  return res.data.length
}
