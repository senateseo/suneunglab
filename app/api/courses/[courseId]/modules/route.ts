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

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 모듈 정보 가져오기
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true })

    if (error) {
      console.error("API: 모듈 목록 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("API: 모듈 목록 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "모듈 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

