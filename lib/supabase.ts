import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL 또는 Anon Key가 없습니다:", {
    url: supabaseUrl ? "설정됨" : "없음",
    key: supabaseAnonKey ? "설정됨" : "없음",
  })
}

console.log("Supabase 클라이언트 초기화:", {
  url: supabaseUrl ? supabaseUrl.substring(0, 10) + "..." : "없음",
  key: supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + "..." : "없음",
})

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

// 연결 테스트
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth 상태 변경:", event, session ? "세션 있음" : "세션 없음")
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

// 테이블 존재 여부 확인 함수
export async function checkTablesExist() {
  try {
    console.log("테이블 존재 여부 확인 중...")

    // courses 테이블 확인
    const { data: coursesData, error: coursesError } = await supabase.from("courses").select("id").limit(1)

    if (coursesError) {
      console.error("courses 테이블 확인 오류:", coursesError)
    } else {
      console.log("courses 테이블 확인 성공")
    }

    // modules 테이블 확인
    const { data: modulesData, error: modulesError } = await supabase.from("modules").select("id").limit(1)

    if (modulesError) {
      console.error("modules 테이블 확인 오류:", modulesError)
    } else {
      console.log("modules 테이블 확인 성공")
    }

    return {
      courses: !coursesError,
      modules: !modulesError,
    }
  } catch (error) {
    console.error("테이블 확인 중 오류 발생:", error)
    return { courses: false, modules: false }
  }
}

// 초기화 시 테이블 확인
checkTablesExist().then((result) => {
  console.log("테이블 확인 결과:", result)
})

