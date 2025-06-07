import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const moduleId = params.moduleId

    if (!moduleId) {
      return NextResponse.json({ error: "모듈 ID가 필요합니다." }, { status: 400 })
    }

    // 강의 정보 가져오기
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("module_id", moduleId)
      .order("order", { ascending: true })

    if (error) {
      console.error("API: 강의 목록 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("API: 강의 목록 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

