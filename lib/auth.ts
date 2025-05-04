import { supabase } from "./supabase-client"

export type AuthUser = {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

// 회원가입
export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      throw error
    }

    return { user: data.user, session: data.session }
  } catch (error: any) {
    console.error("Error signing up:", error.message)
    throw error
  }
}

// 로그인
export async function signIn(email: string, password: string) {
  try {
    console.log("auth.ts: 로그인 시도", email)
    const startTime = Date.now()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log(`auth.ts: 로그인 응답 시간: ${Date.now() - startTime}ms`)

    if (error) {
      console.error("auth.ts: 로그인 오류", error)
      throw error
    }

    console.log("auth.ts: 로그인 성공", data)
    return { user: data.user, session: data.session }
  } catch (error: any) {
    console.error("Error signing in:", error.message)
    throw error
  }
}

// 로그아웃
export async function signOut() {
  try {
    console.log("로그아웃 시도")
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("로그아웃 오류:", error)
      throw error
    }
    console.log("로그아웃 성공")
  } catch (error: any) {
    console.error("Error signing out:", error.message)
    throw error
  }
}

// 현재 사용자 가져오기
export async function getCurrentUser(): Promise<any | null> {
  try {
    console.log("getCurrentUser: 사용자 정보 요청 시작")
    const startTime = Date.now()

    // 세션 확인
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("getCurrentUser: 세션 오류", sessionError)
      return null
    }

    if (!sessionData?.session) {
      console.log("getCurrentUser: 세션 없음")
      return null
    }

    // 세션이 있으면 사용자 정보 가져오기
    const { data, error } = await supabase.auth.getUser()

    console.log(`getCurrentUser: 응답 시간: ${Date.now() - startTime}ms`)

    if (error) {
      console.error("getCurrentUser: 사용자 정보 오류", error)
      return null
    }

    if (!data?.user) {
      console.log("getCurrentUser: 사용자 없음")
      return null
    }

    const user = data.user


    // 사용자가 등록한 강의들도 가져오기
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)

    console.log("getCurrentUser: 등록한 강의들", enrollments)

    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name,
      avatar_url: user.user_metadata?.avatar_url,
      enrollments: enrollments,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// 비밀번호 재설정 이메일 보내기
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error resetting password:", error.message)
    throw error
  }
}

// 비밀번호 업데이트
export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error updating password:", error.message)
    throw error
  }
}

// 사용자 프로필 업데이트
export async function updateProfile(profile: { name?: string; avatar_url?: string }) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: profile,
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error updating profile:", error.message)
    throw error
  }
}

