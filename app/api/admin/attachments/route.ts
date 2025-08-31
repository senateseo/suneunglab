import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const courseId = searchParams.get('course_id')

        if (!courseId) {
            return NextResponse.json(
                { error: "course_id parameter is required" },
                { status: 400 }
            )
        }

        // 첨부파일 조회
        const { data: attachments, error } = await supabase
            .from("attachments")
            .select("*")
            .eq("course_id", courseId)
            .order("created_at", { ascending: true })

        if (error) {
            console.error("첨부파일 조회 오류:", error)
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(attachments)
    } catch (error: any) {
        console.error("첨부파일 조회 중 오류 발생:", error)
        return NextResponse.json(
            { error: error.message || "첨부파일 조회 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { course_id, name, url } = body

        // 입력 검증
        if (!course_id || !name || !url) {
            return NextResponse.json(
                { error: "course_id, name, url 모든 필드가 필요합니다." },
                { status: 400 }
            )
        }

        // 첨부파일 생성
        const { data: attachment, error } = await supabase
            .from("attachments")
            .insert({
                course_id,
                name,
                url,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            console.error("첨부파일 생성 오류:", error)
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(attachment)
    } catch (error: any) {
        console.error("첨부파일 생성 중 오류 발생:", error)
        return NextResponse.json(
            { error: error.message || "첨부파일 생성 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
