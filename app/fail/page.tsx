"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function PaymentFailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorDetails, setErrorDetails] = useState({
    code: "",
    message: "",
    orderId: ""
  })

  useEffect(() => {
    // Extract error information from URL parameters
    const code = searchParams.get("code") || ""
    const message = searchParams.get("message") || "결제 처리 중 오류가 발생했습니다."
    const orderId = searchParams.get("orderId") || ""

    setErrorDetails({
      code,
      message,
      orderId
    })
  }, [searchParams])

  const handleRetry = () => {
    // Use history to go back to the payment page
    router.back()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">결제 실패</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            {errorDetails.code && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">오류 코드</span>
                <span className="font-medium">{errorDetails.code}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">오류 메시지</span>
              <span className="font-medium">{errorDetails.message}</span>
            </div>
            {errorDetails.orderId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 번호</span>
                <span className="font-medium">{errorDetails.orderId}</span>
              </div>
            )}
          </div>
          
          <p className="text-center text-muted-foreground">
            결제 중 문제가 발생했습니다. 다시 시도하거나 다른 결제 수단을 이용해 주세요.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도하기
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              강의 목록으로 돌아가기
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 