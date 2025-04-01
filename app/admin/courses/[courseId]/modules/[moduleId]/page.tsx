"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ModuleEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params?.courseId as string
  const moduleId = params?.moduleId as string
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 모듈 정보 가져오기
    setIsLoading(false)
  }, [courseId, moduleId])

  if (isLoading) {
    return <div className="text-center py-8">모듈 정보를 불러오는 중...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.push(`/admin/courses/${courseId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            강의로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold">모듈 관리</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>모듈 정보</CardTitle>
          <CardDescription>모듈 ID: {moduleId}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>이 페이지는 개발 중입니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}

