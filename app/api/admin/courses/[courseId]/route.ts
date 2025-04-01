import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성 (서비스 역할 키 사용)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const courseId = params.courseId
    console.log("API: 강의 상세 정보 요청 받음", { courseId })

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    // 강의 정보 가져오기
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

    // 모듈 정보 가져오기
    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true })

    if (modulesError) {
      console.error("API: 모듈 정보 조회 오류:", modulesError)
      return NextResponse.json({ error: modulesError.message }, { status: 500 })
    }

    // 모듈에 강의 정보 추가
    const modulesWithLectures = await Promise.all(
      (modulesData || []).map(async (module) => {
        const { data: lecturesData, error: lecturesError } = await supabase
          .from("lectures")
          .select("*")
          .eq("module_id", module.id)
          .order("order", { ascending: true })

        if (lecturesError) {
          console.error("API: 강의 정보 조회 오류:", lecturesError)
          return { ...module, lessons: [] }
        }

        // 강의 데이터를 lessons 형식으로 변환
        const lessons = (lecturesData || []).map((lecture) => ({
          id: lecture.id,
          title: lecture.title,
          duration: lecture.duration || "",
          type: lecture.type,
        }))

        return { ...module, lessons }
      }),
    )

    // 강사 정보 가져오기 (profiles 테이블에서)
    const { data: instructorData, error: instructorError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", courseData.instructor_id)
      .single()

    if (instructorError) {
      console.error("API: 강사 정보 조회 오류:", instructorError)
    }

    // 최종 강의 데이터 구성
    const courseWithDetails = {
      ...courseData,
      modules: modulesWithLectures,
      instructor: instructorData
        ? {
            name: instructorData.name || "강사 이름",
            title: "강의 전문가",
            bio: "강의 전문가입니다.",
            avatar: instructorData.avatar_url || "/placeholder.svg?height=100&width=100",
          }
        : {
            name: "강사 이름",
            title: "강의 전문가",
            bio: "강의 전문가입니다.",
            avatar: "/placeholder.svg?height=100&width=100",
          },
      whatYouWillLearn: [
        "강의의 핵심 개념 이해",
        "실전 문제 해결 능력 향상",
        "체계적인 학습 방법 습득",
        "수능 고득점을 위한 전략",
      ],
    }

    console.log("API: 강의 상세 정보 조회 성공")
    return NextResponse.json(courseWithDetails)
  } catch (error: any) {
    console.error("API: 강의 상세 정보 조회 중 오류 발생:", error)
    return NextResponse.json(
      { error: error.message || "강의 정보를 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

