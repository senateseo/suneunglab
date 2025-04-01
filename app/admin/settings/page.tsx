"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const { user, signOut } = useAuth()
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">관리자 설정</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>계정 정보</CardTitle>
            <CardDescription>관리자 계정 정보를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">이름</h3>
                <p className="font-medium">{user?.name || "이름 미설정"}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">이메일</h3>
                <p className="font-medium">{user?.email}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">역할</h3>
                <p className="font-medium">관리자</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시스템 설정</CardTitle>
            <CardDescription>시스템 관련 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">현재 시스템 설정을 변경할 수 있는 옵션이 없습니다.</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle>계정 작업</CardTitle>
            <CardDescription>관리자 계정 관련 작업을 수행합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">관리자 계정에서 로그아웃</h3>
                <p className="text-sm text-muted-foreground">모든 기기에서 로그아웃됩니다</p>
              </div>
              <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

