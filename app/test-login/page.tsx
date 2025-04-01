"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase, checkSession } from "@/lib/supabase-client"

export default function TestLoginPage() {
  const [email, setEmail] = useState("suneunglab1@gmail.com")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  // 페이지 로드 시 세션 확인
  useEffect(() => {
    async function checkCurrentSession() {
      const { data } = await checkSession()
      setSessionInfo(data)
    }

    checkCurrentSession()
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      console.log("직접 로그인 시도:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("로그인 오류:", error)
        setError(error.message)
        return
      }

      console.log("로그인 성공:", data)
      setResult(data)

      // 세션 정보 확인
      const { data: sessionData } = await checkSession()
      setSessionInfo(sessionData)

      // 사용자 정보 확인
      const { data: userData } = await supabase.auth.getUser()
      console.log("현재 사용자:", userData)

      // 프로필 정보 확인
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      console.log("프로필 정보:", profileData, profileError)
    } catch (err: any) {
      console.error("로그인 처리 중 오류:", err)
      setError(err.message || "알 수 없는 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckSession = async () => {
    const { data } = await checkSession()
    setSessionInfo(data)
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setResult(null)
      setSessionInfo(null)
      setError(null)
    } catch (err: any) {
      setError(err.message || "로그아웃 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle>테스트 로그인</CardTitle>
          <CardDescription>Supabase 직접 로그인 테스트</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인 테스트"}
          </Button>

          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

          {result && (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">로그인 성공!</p>
              <p className="text-sm">사용자 ID: {result.user.id}</p>
              <p className="text-sm">이메일: {result.user.email}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            뒤로 가기
          </Button>
          {result && (
            <Button variant="default" onClick={() => (window.location.href = "/admin/dashboard")}>
              관리자 페이지로 이동
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>세션 정보</CardTitle>
          <CardDescription>현재 인증 세션 상태</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-md overflow-auto max-h-[200px]">
            <pre className="text-xs">{JSON.stringify(sessionInfo, null, 2)}</pre>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCheckSession}>
            세션 확인
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            로그아웃
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

