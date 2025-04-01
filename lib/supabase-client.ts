import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "suneunglab_auth_token",
  },
})

// 세션 상태 디버깅을 위한 함수
export async function checkSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log("현재 세션 상태:", data?.session ? "세션 있음" : "세션 없음")
    if (error) console.error("세션 확인 오류:", error)
    return { data, error }
  } catch (error) {
    console.error("세션 확인 오류:", error)
    return { data: null, error }
  }
}

// 세션 복구 시도 함수
export async function recoverSession() {
  try {
    // 로컬 스토리지에서 세션 확인
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("세션 복구 오류:", error)
      return { data: null, error }
    }

    if (!data.session) {
      console.log("복구할 세션이 없음")
      return { data: null, error: null }
    }

    console.log("세션 복구 성공")
    return { data, error: null }
  } catch (error) {
    console.error("세션 복구 시도 중 예외 발생:", error)
    return { data: null, error }
  }
}

