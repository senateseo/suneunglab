"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function CourseLecturesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params.courseId as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFirstLecture() {
      try {
        setIsLoading(true)
        console.log("강의 첫 페이지: 모듈 정보 가져오기 시작", { courseId })

        // 모듈 정보 가져오기
        const modulesResponse = await fetch(`/api/courses/${courseId}/modules`)

        if (!modulesResponse.ok) {
          const errorData = await modulesResponse.json()
          throw new Error(errorData.error || "모듈 정보를 가져오는 중 오류가 발생했습니다.")
        }

        const modulesData = await modulesResponse.json()
        console.log("강의 첫 페이지: 모듈 정보 가져오기 성공", modulesData)

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
        console.log("강의 첫 페이지: 강의 정보 가져오기 성공", lecturesData)

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

    fetchFirstLecture()
  }, [courseId, router, toast])

  if (isLoading) {
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
            <h2 className="text-xl font-bold mb-2">강의를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild className="w-full">
              <Link href={`/courses/${courseId}`}>강의 정보로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null // 리디렉션 중이므로 아무것도 렌더링하지 않음
}

