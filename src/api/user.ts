import http from './http'

export interface User {
  id: number
  username: string
  password: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
}

export function getUsers() {
  return http.get<User[]>('/users')
}

export function getUserByUsername(username: string) {
  return http.get<User[]>(`/users?username=${username}`)
}

export function createUser(data: Partial<User>) {
  return http.post<User>('/users', data)
}
