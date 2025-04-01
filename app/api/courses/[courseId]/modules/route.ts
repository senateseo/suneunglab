import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const courseId = params.courseId
    console.log("API: 강의 모듈 목록 요청 받음", { courseId })
    console.log("API: 모듈 목록 요청 처리 시작", { courseId })

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 모듈 정보 가져오기
    console.log("API: Supabase 모듈 쿼리 실행", {
      table: "modules",
      condition: `course_id = ${courseId}`,
    })
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true })

    console.log("API: 모듈 목록 쿼리 결과", {
      success: !error,
      count: data?.length || 0,
      error: error ? error.message : null,
    })

    if (error) {
      console.error("API: 모듈 목록 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`API: ${data?.length || 0}개의 모듈 조회됨`)
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("API: 모듈 목록 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "모듈 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

