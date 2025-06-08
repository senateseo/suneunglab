"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Loader, Loader2 } from "lucide-react"

export default function CourseLecturesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const courseId = params.courseId as string
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function redirectToFirstLecture() {
      try {
        // 인증 확인
        if (!user) {
          if (!authLoading) {
            router.push("/auth/login")
          }
          return
        }

        // 등록 확인과 API 호출을 병렬로 처리
        const [isEnrolled, response] = await Promise.all([
          // 등록 확인
          Promise.resolve(user.enrollments?.some(
            (enrollment: any) => enrollment.course_id === courseId
          )),
          // API 호출
          fetch(`/api/courses/${courseId}/first-lecture`)
        ])

        if (!isEnrolled) {
          setError("잘못된 접근입니다")
          toast({
            title: "잘못된 접근입니다",
            description: "이 강의에 등록되지 않았습니다.",
            variant: "destructive",
          })
          // setTimeout 제거 - 즉시 리다이렉션
          router.push("/")
          return
        }
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "강의 정보를 불러올 수 없습니다.")
        }

        const { lectureId } = await response.json()
        
        if (!lectureId) {
          setError("이 강의에는 아직 강의가 없습니다.")
          return
        }

        // 첫 번째 강의로 즉시 리다이렉션
        router.push(`/courses/${courseId}/lectures/${lectureId}`)
        
      } catch (error: any) {
        console.error("Error:", error)
        setError(error.message || "오류가 발생했습니다.")
        toast({
          title: "오류 발생",
          description: error.message,
          variant: "destructive",
        })
      }
    }

    if (user && !authLoading) {
      redirectToFirstLecture()
    }
  }, [user, authLoading, courseId, router, toast])

  // 로딩 상태에서 isLoading state 제거 (authLoading만 사용)
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" />
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
            <p className="text-muted-foreground mb-4">
              {error === "잘못된 접근입니다" 
                ? "이 강의에 등록되지 않았습니다." 
                : error === "이 강의에는 아직 강의가 없습니다."
                  ? "이 강의에는 아직 강의가 없습니다."
                  : "요청하신 강의 정보를 불러올 수 없습니다."
              }
            </p>
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

