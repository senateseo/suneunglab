"use client"

import { useState, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// 실제 로딩 바 구현
function TopLoadingBarContent() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로딩 상태 초기화
    setLoading(false)
    setProgress(0)
  }, [])

  useEffect(() => {
    let isMounted = true

    // 경로 변경 시 로딩 애니메이션 시작
    const handleStart = () => {
      if (!isMounted) return

      setLoading(true)
      setProgress(20)

      // 진행 상태 시뮬레이션
      const timer1 = setTimeout(() => isMounted && setProgress(40), 100)
      const timer2 = setTimeout(() => isMounted && setProgress(60), 200)
      const timer3 = setTimeout(() => isMounted && setProgress(80), 300)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }

    // 로딩 애니메이션 완료
    const handleComplete = () => {
      if (!isMounted) return

      setProgress(100)
      const timer = setTimeout(() => {
        if (isMounted) {
          setLoading(false)
          setProgress(0)
        }
      }, 400)

      return () => clearTimeout(timer)
    }

    handleStart()

    // 약간의 지연 후 완료 처리
    const completeTimer = setTimeout(() => {
      handleComplete()
    }, 500)

    return () => {
      isMounted = false
      clearTimeout(completeTimer)
    }
  }, [pathname, searchParams])

  if (!loading && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
        }}
      />
    </div>
  )
}

// 로딩 바 컴포넌트를 Suspense로 감싸는 래퍼
export function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <TopLoadingBarContent />
    </Suspense>
  )
}

