import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function POST(request: Request) {
  try {
    // 요청 본문에서 강의 데이터 가져오기
    const courseData = await request.json()

    // 필수 필드 확인
    if (!courseData.title || !courseData.description || !courseData.instructor_id) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다: 제목, 설명, 강사 ID는 필수입니다." },
        { status: 400 },
      )
    }

    // 데이터 형식 확인 및 변환
    const formattedCourseData = {
      ...courseData,
      price: Number(courseData.price) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // 강의 생성
    const { data, error } = await supabase.from("courses").insert([formattedCourseData]).select().single()

    if (error) {
      console.error("강의 생성 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("강의 생성 중 오류 발생:", error)
    return NextResponse.json({ error: error.message || "강의 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // 요청 본문에서 강의 데이터 가져오기
    const { courseId, courseData } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 데이터베이스에 없는 필드 제거
    const { instructor, modules, whatYouWillLearn, ...dbSafeData } = courseData

    // 데이터 형식 확인 및 변환
    const formattedCourseData = {
      ...dbSafeData,
      price: dbSafeData.price !== undefined ? Number(dbSafeData.price) : undefined,
      updated_at: new Date().toISOString(),
    }


    // 강의 업데이트
    const { data, error } = await supabase
      .from("courses")
      .update(formattedCourseData)
      .eq("id", courseId)
      .select()
      .single()

    if (error) {
      console.error("강의 업데이트 오류:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("강의 업데이트 중 오류 발생:", error)
    return NextResponse.json({ error: error.message || "강의 업데이트 중 오류가 발생했습니다." }, { status: 500 })
  }
}

