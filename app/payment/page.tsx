"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BookOpen, CreditCard, ArrowLeft, CheckCircle } from "lucide-react"

// Mock data for courses
const courses = {
  "1": {
    id: 1,
    title: "수능 국어 완성",
    description: "문학, 비문학, 화법과 작문, 문법까지 국어 영역의 모든 것을 마스터하세요.",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=400",
    instructor: "김민석",
  },
  "2": {
    id: 2,
    title: "수능 수학 기초",
    description: "수학의 기본 개념부터 차근차근 배워 수능 수학의 기초를 다지세요.",
    price: 129.99,
    image: "/placeholder.svg?height=200&width=400",
    instructor: "이수진",
  },
  "3": {
    id: 3,
    title: "수능 영어 독해 전략",
    description: "지문 유형별 독해 전략과 빈출 어휘를 학습하여 영어 영역을 정복하세요.",
    price: 139.99,
    image: "/placeholder.svg?height=200&width=400",
    instructor: "박준영",
  },
}

// 로딩 상태를 표시하는 컴포넌트
function PaymentPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-10 w-32 bg-muted rounded mb-6"></div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card border rounded-lg h-[500px] animate-pulse"></div>
        </div>
        <div className="md:col-span-1">
          <div className="bg-card border rounded-lg h-[300px] animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// 실제 결제 페이지 컴포넌트
function PaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId") || "1"
  const course = courses[courseId]

  const [agreements, setAgreements] = useState({
    usageAndRefund: false,
    privacy: false,
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const handleAgreementChange = (key) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleCancel = () => {
    router.push(`/courses/${courseId}`)
  }

  const handleProceed = () => {
    if (!agreements.usageAndRefund || !agreements.privacy) {
      alert("진행하려면 모든 약관에 동의해주세요.")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentComplete(true)

      // Redirect to success page after a delay
      setTimeout(() => {
        router.push("/my-page")
      }, 2000)
    }, 1500)
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">강의를 찾을 수 없습니다</h1>
        <Button asChild>
          <Link href="/courses">강의 둘러보기</Link>
        </Button>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">결제 성공!</h2>
            <p className="text-muted-foreground mb-6">{course.title} 강의에 성공적으로 등록되었습니다</p>
            <Button asChild className="w-full">
              <Link href="/my-page">내 강의로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6 pl-0 flex items-center gap-2" onClick={handleCancel}>
        <ArrowLeft className="h-4 w-4" />
        강의로 돌아가기
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">결제</CardTitle>
              <CardDescription>이 강의에 접근하려면 구매를 완료하세요</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Selected Course */}
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">강사: {course.instructor}</p>
                  <div className="flex items-center text-sm text-primary">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>전체 강의 접근 권한</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold mb-4">결제 방법</h3>
                <div className="border rounded-md p-4 bg-muted/30 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0064FF] rounded-md flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">토스페이</p>
                    <p className="text-sm text-muted-foreground">빠르고 안전한 결제</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Agreements */}
              <div>
                <h3 className="font-semibold mb-4">약관 동의</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="usage-refund"
                      checked={agreements.usageAndRefund}
                      onCheckedChange={() => handleAgreementChange("usageAndRefund")}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="usage-refund"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        이용약관 및 환불 정책에 동의합니다
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        <Link href="/terms" className="text-primary hover:underline">
                          이용약관 및 환불 정책 보기
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={agreements.privacy}
                      onCheckedChange={() => handleAgreementChange("privacy")}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="privacy"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        개인정보 처리방침에 동의합니다
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        <Link href="/privacy" className="text-primary hover:underline">
                          개인정보 처리방침 보기
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
                취소
              </Button>
              <Button
                onClick={handleProceed}
                disabled={isProcessing || !agreements.usageAndRefund || !agreements.privacy}
              >
                {isProcessing ? "처리 중..." : "결제 진행하기"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">강의 가격</span>
                <span>₩{Math.round(course.price * 1350).toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>총액</span>
                <span>₩{Math.round(course.price * 1350).toLocaleString()}</span>
              </div>

              <div className="text-sm text-muted-foreground">
                구매를 완료함으로써 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPageContent />
    </Suspense>
  )
}

