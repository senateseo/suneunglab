"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, HomeIcon, BookOpen } from "lucide-react";
import { useAuth } from "../../../contexts/auth-context";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: "",
    orderId: "",
    paymentKey: "",
    amount: 0,
    courseId: "",
    userId: "",
  });

  useEffect(() => {
    // Get query parameters from URL
    const paymentType = searchParams.get("paymentType") || "";
    const orderId = searchParams.get("orderId") || "";
    const paymentKey = searchParams.get("paymentKey") || "";
    const amount = Number(searchParams.get("amount")) || 0;
    const courseId = searchParams.get("courseId") || "";
    const userId = searchParams.get("userId") || "";

    setPaymentDetails({
      paymentType,
      orderId,
      paymentKey,
      amount,
      courseId,
      userId,
    });

    // Call our payment confirmation API with the details from Toss
    async function confirmPayment() {
      try {
        // You might need to get the userId from your auth context or local storage

        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
            userId, // Send the user ID to associate with the payment
            courseId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Payment confirmation failed:", data);
          // Handle payment confirmation failure
          // Maybe redirect to failure page or show error message
        } else {
          console.log("Payment confirmed successfully:", data);
          // Handle successful payment confirmation
          // Maybe update UI to show success message
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    }

    // Only confirm if we have all required parameters
    if (paymentKey && orderId && amount) {
      confirmPayment();
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">결제 성공!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문 번호</span>
              <span className="font-medium">{paymentDetails.orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">결제 금액</span>
              <span className="font-medium">
                ₩{paymentDetails.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-center text-muted-foreground">
            결제가 정상적으로 완료되었습니다. 강의에 바로 접근하실 수 있습니다.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/my-page">
              <BookOpen className="mr-2 h-4 w-4" />내 강의로 이동
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">
              <HomeIcon className="mr-2 h-4 w-4" />
              대시보드로 이동
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
