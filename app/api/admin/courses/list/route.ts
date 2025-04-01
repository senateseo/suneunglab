import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성 (서비스 역할 키 사용)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    console.log("API: 강의 목록 요청 받음")

    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const category = searchParams.get("category")

    // 쿼리 빌드
    let query = supabase.from("courses").select("*")

    // published 파라미터가 있으면 필터링
    if (published === "true") {
      query = query.eq("published", true)
    } else if (published === "false") {
      query = query.eq("published", false)
    }

    // category 파라미터가 있으면 필터링
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    // 정렬
    query = query.order("created_at", { ascending: false })

    // 쿼리 실행
    const { data, error } = await query

    if (error) {
      console.error("API: 강의 목록 조회 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`API: ${data?.length || 0}개의 강의 조회됨`)
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("API: 강의 목록 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

