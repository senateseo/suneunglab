import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request, { params }: { params: { lectureId: string } }) {
  try {
    const lectureId = params.lectureId
    console.log("API: 강의 상세 정보 요청 받음", { lectureId })

    if (!lectureId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 강의 정보 가져오기
    const { data, error } = await supabase.from("lectures").select("*").eq("id", lectureId).single()

    if (error) {
      console.error("API: 강의 정보 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 })
    }

    console.log("API: 강의 상세 정보 조회 성공")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API: 강의 상세 정보 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { lectureId: string } }) {
  try {
    const lectureId = params.lectureId

    if (!lectureId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 강의 삭제
    const { error } = await supabase.from("lectures").delete().eq("id", lectureId)

    if (error) {
      console.error("API: 강의 삭제 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API: 강의 삭제 중 오류 발생:", error)
    return NextResponse.json({ error: error.message || "강의 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

