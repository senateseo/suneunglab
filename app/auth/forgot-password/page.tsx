"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
      toast({
        title: "이메일 전송 완료",
        description: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
      })
    } catch (error: any) {
      toast({
        title: "오류 발생",
        description: error.message || "비밀번호 재설정 이메일을 보내는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">비밀번호 찾기</CardTitle>
            <CardDescription className="text-center">
              계정에 등록된 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSubmitted ? (
              <div className="text-center py-4">
                <p className="mb-4">비밀번호 재설정 링크가 이메일로 전송되었습니다.</p>
                <p className="text-sm text-muted-foreground">
                  이메일이 도착하지 않았나요? 스팸 폴더를 확인하거나 잠시 후 다시 시도해주세요.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "처리 중..." : "비밀번호 재설정 링크 보내기"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              <Link href="/auth/login" className="text-primary hover:underline">
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

