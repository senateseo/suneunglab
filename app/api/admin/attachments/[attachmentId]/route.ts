import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 서버 측 Supabase 클라이언트 생성
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서비스 역할 키 사용
)

export async function DELETE(
    request: Request,
    { params }: { params: { attachmentId: string } }
) {
    try {
        const { attachmentId } = await params

        if (!attachmentId) {
            return NextResponse.json(
                { error: "첨부파일 ID가 필요합니다." },
                { status: 400 }
            )
        }

        // 첨부파일 삭제
        const { error } = await supabase
            .from("attachments")
            .delete()
            .eq("id", attachmentId)

        if (error) {
            console.error("첨부파일 삭제 오류:", error)
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: "첨부파일이 성공적으로 삭제되었습니다." })
    } catch (error: any) {
        console.error("첨부파일 삭제 중 오류 발생:", error)
        return NextResponse.json(
            { error: error.message || "첨부파일 삭제 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}

export async function GET(
    request: Request,
    { params }: { params: { attachmentId: string } }
) {
    try {
        const { attachmentId } = await params

        if (!attachmentId) {
            return NextResponse.json(
                { error: "첨부파일 ID가 필요합니다." },
                { status: 400 }
            )
        }

        // 첨부파일 조회
        const { data: attachment, error } = await supabase
            .from("attachments")
            .select("*")
            .eq("id", attachmentId)
            .single()

        if (error) {
            console.error("첨부파일 조회 오류:", error)
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        if (!attachment) {
            return NextResponse.json(
                { error: "첨부파일을 찾을 수 없습니다." },
                { status: 404 }
            )
        }

        return NextResponse.json(attachment)
    } catch (error: any) {
        console.error("첨부파일 조회 중 오류 발생:", error)
        return NextResponse.json(
            { error: error.message || "첨부파일 조회 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
