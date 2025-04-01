"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// 클라이언트 컴포넌트를 동적으로 가져오기
const CourseEditPage = dynamic(() => import("../[courseId]/page"), { ssr: false })

export default function NewCoursePage() {
  const router = useRouter()

  // 페이지 로드 시 URL 확인
  useEffect(() => {
    // URL이 /admin/courses/new인지 확인
    const path = window.location.pathname
    if (path === "/admin/courses/new") {
      console.log("새 강의 생성 페이지 로드")
    }
  }, [])

  // 명시적으로 새 강의 생성 페이지임을 표시
  return (
    <div key="new-course-container" data-new-course="true">
      <CourseEditPage />
    </div>
  )
}

