"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function CourseLecturesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const courseId = params.courseId as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    
    async function checkAuthAndEnrollment() {
      try {
        setIsLoading(true)

        // 1. 인증 상태 확인
        if (!user) {
          if (!authLoading) {
            // 로그인 페이지로 리다이렉션
            router.push("/auth/login")
            return
          }
          // 아직 로딩 중이면 기다림
          return
        }

        // 2. 코스 등록 상태 확인
        const isEnrolled = user.enrollments?.some(
          (enrollment: any) => enrollment.course_id === courseId
        )

        if (!isEnrolled) {
          setError("잘못된 접근입니다")
          toast({
            title: "잘못된 접근입니다",
            description: "이 강의에 등록되지 않았습니다.",
            variant: "destructive",
          })
          setTimeout(() => {
            router.push("/")
          }, 2000)
          return
        }

        // 3. 인증과 등록이 확인되면 첫 번째 강의 찾기
        await fetchFirstLecture()
      } catch (error: any) {
        console.error("Error checking auth and enrollment:", error)
        setError(error.message || "오류가 발생했습니다.")
        setIsLoading(false)
      }
    }

    if(user){
      checkAuthAndEnrollment()
    }
    
  }, [courseId, router, toast, user, authLoading])

  async function fetchFirstLecture() {
    try {
      // 모듈 정보 가져오기
      const modulesResponse = await fetch(`/api/courses/${courseId}/modules`)

      if (!modulesResponse.ok) {
        const errorData = await modulesResponse.json()
        throw new Error(errorData.error || "모듈 정보를 가져오는 중 오류가 발생했습니다.")
      }

      const modulesData = await modulesResponse.json()

      if (!modulesData || modulesData.length === 0) {
        setError("이 강의에는 아직 모듈이 없습니다.")
        setIsLoading(false)
        return
      }

      // 첫 번째 모듈의 강의 정보 가져오기
      const firstModuleId = modulesData[0].id
      const lecturesResponse = await fetch(`/api/modules/${firstModuleId}/lectures`)

      if (!lecturesResponse.ok) {
        const errorData = await lecturesResponse.json()
        throw new Error(errorData.error || "강의 정보를 가져오는 중 오류가 발생했습니다.")
      }

      const lecturesData = await lecturesResponse.json()

      if (!lecturesData || lecturesData.length === 0) {
        setError("이 모듈에는 아직 강의가 없습니다.")
        setIsLoading(false)
        return
      }

      // 첫 번째 강의로 리디렉션
      const firstLectureId = lecturesData[0].id
      router.push(`/courses/${courseId}/lectures/${firstLectureId}`)
    } catch (error: any) {
      console.error("Error fetching first lecture:", error)
      setError(error.message || "강의 정보를 불러오는 중 오류가 발생했습니다.")
      setIsLoading(false)

      toast({
        title: "오류 발생",
        description: error.message || "강의 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-2">강의 정보를 불러오는 중...</p>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">
              {error === "잘못된 접근입니다" ? "잘못된 접근입니다" : "강의를 찾을 수 없습니다"}
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild className="w-full">
              <Link href={error === "잘못된 접근입니다" ? "/" : `/courses/${courseId}`}>
                {error === "잘못된 접근입니다" ? "홈으로 이동" : "강의 정보로 돌아가기"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null // 리디렉션 중이므로 아무것도 렌더링하지 않음
}

