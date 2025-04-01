"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { type AuthUser, getCurrentUser, signOut as authSignOut, signUp as authSignUp } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import type { UserRole } from "@/types"
import { recoverSession } from "@/lib/supabase-client"

// AuthUser 타입 확장
interface ExtendedAuthUser extends AuthUser {
  role?: UserRole
  status?: string
}

interface AuthContextType {
  user: ExtendedAuthUser | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const authCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true) // 컴포넌트 마운트 상태 추적

  // 초기 사용자 로드 및 인증 상태 변경 감지
  useEffect(() => {
    // 컴포넌트 마운트 시 플래그 설정
    isMountedRef.current = true

    // 안전한 상태 업데이트 함수
    const safeSetState = (setter: any, value: any) => {
      if (isMountedRef.current) {
        setter(value)
      }
    }

    const fetchUser = async () => {
      try {
        if (!isMountedRef.current) return

        console.log("인증 상태 확인 시작")
        safeSetState(setIsLoading, true)

        // 타임아웃 설정 (15초)
        authCheckTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.log("인증 상태 확인 타임아웃 발생")
            safeSetState(setIsLoading, false)
            safeSetState(setUser, null)
          }
        }, 15000)

        // 먼저 세션 복구 시도
        const sessionResult = await recoverSession()
        console.log("세션 복구 결과:", sessionResult.data ? "세션 있음" : "세션 없음")

        if (!isMountedRef.current) return

        // 현재 사용자 정보 가져오기
        let currentUser = null
        try {
          currentUser = await getCurrentUser()
          console.log("현재 사용자:", currentUser)
        } catch (userError) {
          console.error("사용자 정보 가져오기 오류:", userError)
        }

        if (!isMountedRef.current) return

        if (currentUser) {
          // 특정 관리자 이메일 목록 (임시 해결책)
          const adminEmails = ["suneunglab1@gmail.com", "admin@example.com"] // 필요한 관리자 이메일 추가

          // 사용자 프로필 정보 가져오기 시도
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role, status")
              .eq("id", currentUser.id)
              .single()

            console.log("프로필 조회 결과:", { data, error, currentUser })

            if (!isMountedRef.current) return

            if (!error && data) {
              safeSetState(setUser, {
                ...currentUser,
                role: data.role || "user",
                status: data.status || "active",
              })
            } else {
              // 프로필 정보를 가져오는 데 실패했지만 이메일이 관리자 목록에 있는 경우
              if (adminEmails.includes(currentUser.email)) {
                console.log("이메일 기반으로 관리자 권한 부여:", currentUser.email)
                safeSetState(setUser, {
                  ...currentUser,
                  role: "admin",
                  status: "active",
                })
              } else {
                console.warn("프로필 정보를 찾을 수 없음, 기본 사용자로 설정:", currentUser)
                safeSetState(setUser, currentUser)
              }
            }
          } catch (profileError) {
            if (!isMountedRef.current) return

            console.error("프로필 정보 조회 오류:", profileError)

            // 프로필 조회 실패 시 이메일 기반으로 관리자 여부 결정 (임시 해결책)
            if (adminEmails.includes(currentUser.email)) {
              console.log("이메일 기반으로 관리자 권한 부여:", currentUser.email)
              safeSetState(setUser, {
                ...currentUser,
                role: "admin",
                status: "active",
              })
            } else {
              safeSetState(setUser, currentUser)
            }
          }
        } else {
          safeSetState(setUser, null)
        }
      } catch (error) {
        if (!isMountedRef.current) return

        console.error("Error fetching user:", error)
        safeSetState(setUser, null)
      } finally {
        // 타임아웃 제거
        if (authCheckTimeoutRef.current) {
          clearTimeout(authCheckTimeoutRef.current)
          authCheckTimeoutRef.current = null
        }

        if (isMountedRef.current) {
          console.log("인증 상태 확인 완료, isLoading = false")
          safeSetState(setIsLoading, false)
        }
      }
    }

    fetchUser()

    // 인증 상태 변경 감지
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("인증 상태 변경:", event, session ? "세션 있음" : "세션 없음")

      if (!isMountedRef.current) return

      if (event === "SIGNED_IN" && session) {
        await fetchUser()
      } else if (event === "SIGNED_OUT") {
        safeSetState(setUser, null)
      }
    })

    return () => {
      // 컴포넌트 언마운트 시 플래그 설정 및 리소스 정리
      isMountedRef.current = false

      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current)
        authCheckTimeoutRef.current = null
      }

      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  // 회원가입 함수
  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      await authSignUp(email, password, name)
      router.push("/auth/verify-email")
    } catch (error: any) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 로그인 함수
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)

    // 타임아웃 설정
    const loginTimeout = setTimeout(() => {
      console.error("로그인 타임아웃 발생")
      setIsLoading(false)
      throw new Error("로그인 요청이 시간 초과되었습니다. 다시 시도해주세요.")
    }, 10000) // 10초 타임아웃

    try {
      console.log("로그인 시도:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // 타임아웃 취소
      clearTimeout(loginTimeout)

      if (error) {
        console.error("로그인 오류:", error.message)
        throw error
      }

      console.log("로그인 성공:", data)

      // 특정 관리자 이메일 목록 (임시 해결책)
      const adminEmails = ["suneunglab1@gmail.com", "admin@example.com"]

      // 관리자 이메일인 경우 바로 관리자 권한 부여
      if (adminEmails.includes(data.user.email || "")) {
        console.log("이메일 기반으로 관리자 권한 부여:", data.user.email)

        const userWithRole = {
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url,
          role: "admin",
          status: "active",
        }

        setUser(userWithRole)

        // 페이지 이동 전에 상태 업데이트가 반영될 시간을 줍니다
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 100)
        return
      }

      // 사용자 프로필 정보 가져오기 시도
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", data.user.id)
          .single()

        console.log("프로필 데이터:", profileData, "프로필 오류:", profileError)

        if (!profileError && profileData) {
          const userWithRole = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name,
            avatar_url: data.user.user_metadata?.avatar_url,
            role: profileData.role || "user",
            status: profileData.status || "active",
          }

          setUser(userWithRole)

          // 사용자 상태 확인
          if (profileData.status === "blocked") {
            throw new Error("계정이 차단되었습니다. 관리자에게 문의하세요.")
          }

          // 관리자인 경우 관리자 페이지로 리디렉션
          if (profileData.role === "admin") {
            router.push("/admin/dashboard")
          } else {
            router.push("/my-page")
          }
        } else {
          // 프로필이 없는 경우 기본 사용자 정보 설정
          setUser({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name,
            avatar_url: data.user.user_metadata?.avatar_url,
            role: "user",
            status: "active",
          })
          router.push("/my-page")
        }
      } catch (profileError) {
        console.error("프로필 정보 조회 오류:", profileError)

        // 프로필 조회 실패 시 기본 사용자 정보로 설정
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url,
          role: "user",
          status: "active",
        })

        router.push("/my-page")
      }
    } catch (error: any) {
      // 타임아웃 취소
      clearTimeout(loginTimeout)

      console.error("로그인 처리 중 오류:", error)
      throw error
    } finally {
      // 타임아웃 취소
      clearTimeout(loginTimeout)
      setIsLoading(false)
    }
  }

  // 로그아웃 함수
  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await authSignOut()
      setUser(null)
      router.push("/")
    } catch (error: any) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 관리자 여부 확인
  // 관리자 여부 확인 (임시 해결책)
  const isAdmin = Boolean(
    user?.role === "admin" || (user?.email && ["suneunglab1@gmail.com", "admin@example.com"].includes(user.email)),
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // 개발 환경에서만 에러를 콘솔에 출력
    if (process.env.NODE_ENV !== "production") {
      console.error("useAuth must be used within an AuthProvider")
    }
    // 기본값 반환
    return {
      user: null,
      isLoading: false,
      signUp: async () => {
        throw new Error("Auth provider not available")
      },
      signIn: async () => {
        throw new Error("Auth provider not available")
      },
      signOut: async () => {
        throw new Error("Auth provider not available")
      },
      isAdmin: false,
    }
  }
  return context
}

