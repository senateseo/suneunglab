"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 초기 상태 설정
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // 초기 실행
    checkMobile()

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", checkMobile)

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [breakpoint])

  return isMobile
}

