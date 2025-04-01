"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function SettingsPage() {
  const { user, signOut, isLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await signOut()
      toast({
        title: "로그아웃 성공",
        description: "성공적으로 로그아웃되었습니다.",
      })
    } catch (error: any) {
      toast({
        title: "로그아웃 실패",
        description: error.message || "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  // 로딩 중이거나 사용자가 없는 경우 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p>로딩 중...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-8 space-y-4">
        <p>로그인이 필요합니다.</p>
        <Button asChild>
          <Link href="/auth/login">로그인하러 가기</Link>
        </Button>
      </div>
    )
  }

  // 가입일 포맷팅 (예시)
  const joinedDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">설정</h1>
        <p className="text-muted-foreground">계정 설정 및 환경설정 관리</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>일반 정보</CardTitle>
          <CardDescription>개인 정보 및 계정 세부 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">이름</h3>
              <p className="font-medium">{user.name || "이름 미설정"}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">이메일</h3>
              <p className="font-medium">{user.email}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">가입일</h3>
              <p className="font-medium">{joinedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            계정 작업
          </CardTitle>
          <CardDescription>확인이 필요한 계정 관련 작업</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">계정에서 로그아웃</h3>
              <p className="text-sm text-muted-foreground">모든 기기에서 로그아웃됩니다</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

