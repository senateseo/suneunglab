import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single()


    if (courseError) {
      console.error("API: 강의 정보 조회 오류:", courseError)
      return NextResponse.json({ error: courseError.message }, { status: 500 })
    }

    if (!courseData) {
      return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json(courseData)
  } catch (error: any) {
    console.error("API: 강의 상세 정보 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

