import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/lib/auth"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request) {
  try {

    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const userId = searchParams.get("userId")

    // 쿼리 빌드
    let query = supabase.from("lecture_progress").select("*").eq("user_id", userId)

    // courseId 파라미터가 있으면 필터링
    if (courseId) {
      // 해당 강의의 모든 모듈 ID 가져오기
      const { data: modules } = await supabase.from("modules").select("id").eq("course_id", courseId)

      if (modules && modules.length > 0) {
        const moduleIds = modules.map((m) => m.id)

        // 해당 모듈의 모든 강의 ID 가져오기
        const { data: lectures } = await supabase.from("lectures").select("id").in("module_id", moduleIds)

        if (lectures && lectures.length > 0) {
          const lectureIds = lectures.map((l) => l.id)
          query = query.in("lecture_id", lectureIds)
        }
      }
    }

    // 쿼리 실행
    const { data, error } = await query

    if (error) {
      console.error("API: 강의 진행 상황 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`API: ${data?.length || 0}개의 강의 진행 상황 조회됨`)
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("API: 강의 진행 상황 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 진행 상황을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
  

    // 요청 본문에서 데이터 가져오기
    const { lectureId, completed, userId} = await request.json()

    if (!lectureId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 강의 진행 상황 확인
    const { data: existingProgress, error: checkError } = await supabase
      .from("lecture_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lecture_id", lectureId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116: 결과가 없음
      console.error("API: 강의 진행 상황 확인 오류:", checkError)
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    let result

    if (existingProgress) {
      // 기존 진행 상황 업데이트
      const { data, error } = await supabase
        .from("lecture_progress")
        .update({
          completed: completed,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", existingProgress.id)
        .select()
        .single()

      if (error) {
        console.error("API: 강의 진행 상황 업데이트 오류:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data
    } else {
      // 새 진행 상황 생성
      const { data, error } = await supabase
        .from("lecture_progress")
        .insert([
          {
            user_id: userId,
            lecture_id: lectureId,
            completed: completed,
            last_accessed: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("API: 강의 진행 상황 생성 오류:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("API: 강의 진행 상황 업데이트 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 진행 상황을 업데이트하는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

