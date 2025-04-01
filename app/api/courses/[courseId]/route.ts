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
    console.log("API: 강의 상세 정보 요청 받음", { courseId })
    // 디버깅 로그 추가
    // try 블록 시작 부분에 추가:
    console.log("API: 강의 상세 정보 요청 처리 시작", { courseId, url: process.env.NEXT_PUBLIC_SUPABASE_URL })

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 강의 정보 가져오기
    // 쿼리 실행 전에 추가:
    console.log("API: Supabase 쿼리 실행", {
      table: "courses",
      condition: `id = ${courseId}`,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "설정됨" : "설정되지 않음",
    })
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single()

    // 쿼리 결과 확인 후 추가:
    console.log("API: 강의 정보 쿼리 결과", {
      success: !courseError,
      dataExists: !!courseData,
      error: courseError ? courseError.message : null,
    })

    if (courseError) {
      console.error("API: 강의 정보 조회 오류:", courseError)
      return NextResponse.json({ error: courseError.message }, { status: 500 })
    }

    if (!courseData) {
      return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 })
    }

    console.log("API: 강의 상세 정보 조회 성공")
    return NextResponse.json(courseData)
  } catch (error: any) {
    console.error("API: 강의 상세 정보 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

