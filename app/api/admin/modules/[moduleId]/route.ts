import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const { moduleId } = await params
    

    if (!moduleId) {
      return NextResponse.json({ error: "모듈 ID가 필요합니다." }, { status: 400 })
    }

    // 모듈 정보 가져오기
    const { data, error } = await supabase.from("modules").select("*").eq("id", moduleId).single()

    if (error) {
      console.error("API: 모듈 정보 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "모듈을 찾을 수 없습니다." }, { status: 404 })
    }

    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API: 모듈 상세 정보 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "모듈 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const { moduleId } = await params
    const moduleData = await request.json()

    if (!moduleId) {
      return NextResponse.json({ error: "모듈 ID가 필요합니다." }, { status: 400 })
    }

    // 데이터 형식 확인 및 변환
    const formattedModuleData = {
      ...moduleData,
      updated_at: new Date().toISOString(),
    }

    // 모듈 업데이트
    const { data, error } = await supabase
      .from("modules")
      .update(formattedModuleData)
      .eq("id", moduleId)
      .select()
      .single()

    if (error) {
      console.error("API: 모듈 업데이트 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API: 모듈 업데이트 중 오류 발생:", error)
    return NextResponse.json({ error: error.message || "모듈 업데이트 중 오류가 발생했습니다." }, { status: 500 })
  }
}

