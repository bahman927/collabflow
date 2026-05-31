// src/types/user.ts
export interface User {
  id: number
  email: string
  full_name: string
  workspace?: {
    id: number
    name: string
  }
}