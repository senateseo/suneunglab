// 사용자 역할 타입
export type UserRole = "user" | "admin"

// 사용자 상태 타입
export type UserStatus = "active" | "blocked"

// 사용자 타입
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: UserRole
  status: UserStatus
  created_at: string
}

// 강의 타입
export interface Course {
  id: string
  title: string
  description: string
  long_description?: string
  category: string
  level: string
  duration: string
  price: number
  image_url?: string
  instructor_id: string
  created_at: string
  updated_at: string
  published: boolean
  for_text?: string
  not_for?: string
}

// 첨부파일 타입
export interface Attachment {
  id: string
  course_id: string
  name: string
  url: string
  created_at: string
  updated_at: string
}

// 모듈 타입
export interface Module {
  id: string
  course_id: string
  title: string
  order: number
}

// 강의 타입
export interface Lecture {
  id: string
  module_id: string
  title: string
  description?: string
  video_url?: string
  duration?: string
  order: number
  type: "video" | "assignment" | "quiz"
}

