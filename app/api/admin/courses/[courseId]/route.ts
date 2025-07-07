import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성 (서비스 역할 키 사용)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = await params
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
          name: instructorData.name || "송이삭",
          title: "송이삭",
          bio: "송이삭",
          avatar: instructorData.avatar_url || "/placeholder.svg?height=100&width=100",
        }
        : {
          name: "송이삭",
          title: "송이삭",
          bio: "송이삭",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      whatYouWillLearn: [
        "영어 문장 해석이 고민되는 학생",
        "영어 문장의 구조부터 배우고 싶은 학생",
        "문장의 구조는 알지만 실질적인 해석이 되지 않는 학생",
        "영어를 감으로 푸는 학생",
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

