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
  global: {
    fetch: (...args) => {
      // 요청 시작 시간 기록
      const startTime = Date.now()
      const url = typeof args[0] === "string" ? args[0] : args[0] instanceof URL ? args[0].toString() : "unknown"
      console.log("Supabase 요청 시작:", url)

      return fetch(...args)
        .then((response) => {
          // 요청 완료 시간 및 소요 시간 기록
          const endTime = Date.now()
          console.log(`Supabase 요청 완료: ${url}, 소요 시간: ${endTime - startTime}ms, 상태: ${response.status}`)
          return response
        })
        .catch((error) => {
          console.error("Supabase 요청 오류:", error)
          throw error
        })
    },
  },
})

// 세션 복구 시도
export async function recoverSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log("세션 복구 시도:", data?.session ? "세션 있음" : "세션 없음", error ? `오류: ${error.message}` : "")
    return { data, error }
  } catch (error) {
    console.error("세션 복구 오류:", error)
    return { data: null, error }
  }
}


