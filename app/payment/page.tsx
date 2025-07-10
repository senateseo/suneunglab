"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../../contexts/auth-context";

// Mock data for courses

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
  );
}

console.log("PROCESS ENV ", process.env.NODE_ENV);

const clientKey: any =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY_PROD
    : process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY_DEV;
// 실제 결제 페이지 컴포넌트
function PaymentPageContent() {
  function generateRandomString() {
    if (typeof window !== "undefined") {
      return window.btoa(Math.random().toString()).slice(0, 20);
    }
    // Fallback for server-side
    return Math.random().toString(36).substring(2, 22);
  }

  const customerKey =
    typeof window !== "undefined" ? generateRandomString() : "";
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId") || "1";
  const [course, setCourse] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const [agreements, setAgreements] = useState({
    usageAndRefund: false,
    privacy: false,
  });

  console.log("course", course);
  const [amount, setAmount]: any = useState({
    currency: "KRW",
    value: course?.price || 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [widgets, setWidgets]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        const widgets = tossPayments.widgets({
          customerKey,
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, [courseId]);

  useEffect(() => {
    async function fetchCourse() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        const data = await response.json();
        setCourse(data);
        setAmount({
          currency: "KRW",
          value: data.price,
        });

        await widgets.setAmount(data.price);
        console.log("amount", amount);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      await fetchCourse();

      // ------  주문서의 결제 금액 설정 ------
      // TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
      // TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, courseId]);

  const handleAgreementChange = (key: string) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCancel = () => {
    router.push(`/courses/${courseId}`);
  };

  const handleProceed = async () => {
    if (!agreements.usageAndRefund || !agreements.privacy) {
      alert("진행하려면 모든 약관에 동의해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      await widgets.requestPayment({
        orderId: generateRandomString(), // 고유 주문 번호
        orderName: course.title,
        successUrl:
          origin +
          "/widget/success?courseId=" +
          courseId +
          "&userId=" +
          user?.id, // 결제 요청이 성공하면 리다이렉트되는 URL
        failUrl: origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
        customerEmail: user?.email,
        customerName: user?.name,
        // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
        // customerMobilePhone: "01012341234",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">결제 성공!</h2>
            <p className="text-muted-foreground mb-6">
              {course.title} 강의에 성공적으로 등록되었습니다
            </p>
            <Button asChild className="w-full">
              <Link href="/my-page">내 강의로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6 pl-0 flex items-center gap-2"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          강의로 돌아가기
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">결제</CardTitle>
                <CardDescription>
                  이 강의에 접근하려면 구매를 완료하세요
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Selected Course */}
                {course && (
                  <div className="flex gap-4 items-start">
                    <div className="w-30 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={course.image_url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        강사: 송이삭
                      </p>
                      <div className="flex items-center text-sm text-primary">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>전체 강의 접근 권한</span>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Payment Method */}
                <div id="payment-method" />
                {/* Agreements */}
                <div id="agreement" />

                <Separator />

                {/* Agreements */}
                <div>
                  <h3 className="font-semibold mb-4">약관 동의</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="usage-refund"
                        checked={agreements.usageAndRefund}
                        onCheckedChange={() =>
                          handleAgreementChange("usageAndRefund")
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="usage-refund"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          이용약관 및 환불 정책에 동의합니다
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          <Link
                            href="/terms"
                            className="text-primary hover:underline"
                          >
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
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
                            개인정보 처리방침 보기
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  취소
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={
                    isProcessing ||
                    !agreements.usageAndRefund ||
                    !agreements.privacy
                  }
                >
                  {isProcessing ? "처리 중..." : "결제 진행하기"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          {course && (
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>주문 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">강의 가격</span>
                    <span>₩{Math.round(course.price).toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>총액</span>
                    <span>₩{Math.round(course.price).toLocaleString()}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    구매를 완료함으로써 이용약관 및 개인정보 처리방침에 동의하게
                    됩니다.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      )
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPageContent />
    </Suspense>
  );
}
