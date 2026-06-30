import http from './http'

export interface TradeItem {
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

export function createTrade(data: Partial<TradeItem>) {
  return http.post<TradeItem>('/secondHand', data)
}
