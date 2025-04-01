import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">이메일 인증</CardTitle>
            <CardDescription className="text-center">
              가입하신 이메일 주소로 인증 링크를 보냈습니다. 이메일을 확인하고 링크를 클릭하여 계정 인증을 완료해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              이메일이 도착하지 않았나요? 스팸 폴더를 확인하거나 잠시 후 다시 시도해주세요.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/login">로그인 페이지로 돌아가기</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

