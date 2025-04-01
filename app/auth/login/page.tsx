"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()


  // 인증 로딩 중이면 로딩 상태 표시
  if (authLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center">
          <p className="mb-2">인증 상태 확인 중...</p>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("로그인 시도 중...", email)

      // 직접 Supabase 클라이언트를 사용하여 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Supabase 로그인 오류:", error)
        throw error
      }

      console.log("Supabase 로그인 성공:", data)

      // 로그인 성공 후 사용자 정보 설정 및 리디렉션
      if (data.user) {
        // 관리자 이메일 목록 (임시 해결책)
        const adminEmails = ["suneunglab1@gmail.com", "admin@example.com"]

        // 이메일 기반으로 관리자 여부 확인
        const isAdmin = adminEmails.includes(data.user.email || "")

        toast({
          title: "로그인 성공",
          description: "수능연구소에 오신 것을 환영합니다!",
        })

        // 세션이 완전히 설정될 시간을 주기 위해 약간의 지연 후 리디렉션
        setTimeout(() => {
          if (isAdmin) {
            console.log("관리자로 리디렉션")
            window.location.href = "/admin/dashboard"
          } else {
            console.log("일반 사용자로 리디렉션")
            window.location.href = "/my-page"
          }
        }, 500)

        return
      }
    } catch (error: any) {
      console.error("로그인 오류:", error)
      toast({
        title: "로그인 실패",
        description: error.message || "이메일 또는 비밀번호를 확인해주세요.",
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
            <CardTitle className="text-2xl text-center">다시 오신 것을 환영합니다</CardTitle>
            <CardDescription className="text-center">계속 학습하려면 계정에 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full" type="button">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                  <path
                    d="M21.6,10.2H12v3.8h5.5c-0.5,2.5-2.7,4.3-5.5,4.3c-3.3,0-6-2.7-6-6s2.7-6,6-6c1.4,0,2.7,0.5,3.8,1.3l2.9-2.9 C17.1,3.2,14.7,2,12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c8.4,0,10.4-7.8,9.6-11.8L21.6,10.2z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12,17.3c-2.9,0-5.3-2.4-5.3-5.3S9.1,6.7,12,6.7c1.4,0,2.7,0.6,3.7,1.5l-1.8,1.8c-0.5-0.5-1.2-0.8-1.9-0.8 c-1.6,0-3,1.3-3,3s1.3,3,3,3c1.1,0,2-0.6,2.5-1.5h-2.5v-2.3h4.8c0.1,0.4,0.2,0.8,0.2,1.3C17.3,15.3,15,17.3,12,17.3z"
                    fill="#FFFFFF"
                  />
                </svg>
                구글로 로그인
              </Button>
              <Button variant="outline" className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black" type="button">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                  <path
                    d="M12,3c-5,0-9,3.1-9,7c0,2.4,1.3,4.5,3.4,5.8c0.2,0.1,0.3,0.3,0.3,0.5c-0.1,0.4-0.3,1.5-0.4,1.7 c-0.1,0.4,0.1,0.4,0.4,0.3c0.2-0.1,2.9-1.9,4-2.7c0.4-0.3,0.6-0.3,0.9-0.3c5,0,9-3.1,9-7S17,3,12,3z"
                    fill="#000000"
                  />
                </svg>
                카카오로 로그인
              </Button>
              <Button variant="outline" className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white" type="button">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                  <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" fill="#FFFFFF" />
                </svg>
                네이버로 로그인
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는 이메일로 계속하기</span>
              </div>
            </div>

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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">비밀번호</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">로그인 중...</span>
                      <span className="sr-only">로딩 중</span>
                    </>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              아직 회원이 아니신가요?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

