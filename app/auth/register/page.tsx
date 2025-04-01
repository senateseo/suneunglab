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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // 이미 로그인한 사용자가 회원가입 페이지에 접근하면 메인 페이지로 리디렉션
  useEffect(() => {
    if (!authLoading && user) {
      console.log("이미 로그인된 사용자가 회원가입 페이지에 접근, 메인 페이지로 리디렉션")
      router.push("/")
    }
  }, [user, authLoading, router])

  // 인증 로딩 중이거나 이미 로그인한 경우 회원가입 폼을 표시하지 않음
  if (authLoading || user) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center">
          <p>리디렉션 중...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, name)
      toast({
        title: "회원가입 성공",
        description: "이메일 인증을 완료해주세요.",
      })
    } catch (error: any) {
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
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
            <CardTitle className="text-2xl text-center">계정 만들기</CardTitle>
            <CardDescription className="text-center">아래 정보를 입력하여 새 계정을 만드세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Signup Buttons */}
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
                구글로 가입하기
              </Button>
              <Button variant="outline" className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black" type="button">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                  <path
                    d="M12,3c-5,0-9,3.1-9,7c0,2.4,1.3,4.5,3.4,5.8c0.2,0.1,0.3,0.3,0.3,0.5c-0.1,0.4-0.3,1.5-0.4,1.7 c-0.1,0.4,0.1,0.4,0.4,0.3c0.2-0.1,2.9-1.9,4-2.7c0.4-0.3,0.6-0.3,0.9-0.3c5,0,9-3.1,9-7S17,3,12,3z"
                    fill="#000000"
                  />
                </svg>
                카카오로 가입하기
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는 이메일로 가입하기</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "가입 중..." : "가입하기"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

