import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    // Raw SQL로 단일 쿼리 실행
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT l.id as lecture_id
        FROM lectures l
        INNER JOIN modules m ON l.module_id = m.id
        WHERE m.course_id = $1
        ORDER BY m."order" ASC, l."order" ASC
        LIMIT 1
      `,
      params: [courseId]
    })

    if (error) {
      console.error('Raw SQL 오류:', error)
      // Raw SQL이 안 되면 폴백으로 2단계 쿼리 사용
      return await fallbackQuery(courseId)
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '이 강의에는 아직 강의가 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ lectureId: data[0].lecture_id })
  } catch (error) {
    console.error('Error:', error)
    // 에러 시 폴백
    return await fallbackQuery(courseId)
  }
}

// 폴백 함수 - 확실히 작동하는 2단계 쿼리
async function fallbackQuery(courseId: string) {
  try {
    // 최적화된 2단계 쿼리 (필요한 필드만 선택)
    const { data: firstModule } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId)
      .order('order', { ascending: true })
      .limit(1)
      .single()

    if (!firstModule) {
      return NextResponse.json(
        { error: '이 강의에는 아직 강의가 없습니다.' },
        { status: 404 }
      )
    }

    const { data: firstLecture } = await supabase
      .from('lectures')
      .select('id')
      .eq('module_id', firstModule.id)
      .order('order', { ascending: true })
      .limit(1)
      .single()

    if (!firstLecture) {
      return NextResponse.json(
        { error: '이 강의에는 아직 강의가 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ lectureId: firstLecture.id })
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 