"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // 인증 로딩 중이면 로딩 상태 표시
  if (authLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center">
          <p className="mb-2">인증 상태 확인 중...</p>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("로그인 시도 중...", email);

      // 직접 Supabase 클라이언트를 사용하여 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase 로그인 오류:", error);
        throw error;
      }

      console.log("Supabase 로그인 성공:", data);

      // 로그인 성공 후 사용자 정보 설정 및 리디렉션
      if (data.user) {
        // 관리자 이메일 목록 (임시 해결책)
        const adminEmails = ["suneunglab1@gmail.com", "admin@example.com"];

        // 이메일 기반으로 관리자 여부 확인
        const isAdmin = adminEmails.includes(data.user.email || "");

        toast({
          title: "로그인 성공",
          description: "수능연구소에 오신 것을 환영합니다!",
        });

        // 세션이 완전히 설정될 시간을 주기 위해 약간의 지연 후 리디렉션
        setTimeout(() => {
          if (isAdmin) {
            console.log("관리자로 리디렉션");
            window.location.href = "/admin/dashboard";
          } else {
            console.log("일반 사용자로 리디렉션");
            window.location.href = "/my-page";
          }
        }, 500);

        return;
      }
    } catch (error: any) {
      console.error("로그인 오류:", error);
      toast({
        title: "로그인 실패",
        description: error.message || "이메일 또는 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            process.env.NODE_ENV === "development"
              ? `${window.location.origin}`
              : "https://snlab.kr",
        },
      });

      if (error) {
        console.error("Supabase 로그인 오류:", error);
        throw error;
      }

      console.log("Supabase 로그인 성공:", data);
    } catch (error: any) {
      console.error("구글 로그인 오류:", error);
      toast({
        title: "구글 로그인 실패",
        description: error.message || "구글 로그인에 실패했습니다.",
      });
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
      });

      if (error) {
        console.error("Supabase 로그인 오류:", error);
        throw error;
      }

      console.log("Kakao 로그인 성공:", data);
    } catch (error: any) {
      console.error("카카오 로그인 오류:", error);
      toast({
        title: "카카오 로그인 실패",
        description: error.message || "카카오 로그인에 실패했습니다.",
      });
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              다시 오신 것을 환영합니다
            </CardTitle>
            <CardDescription className="text-center">
              계속 학습하려면 계정에 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2443"
                  height="2500"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 262"
                  id="google"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                구글로 로그인
              </Button>
              <Button
                variant="outline"
                className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black"
                type="button"
                onClick={handleKakaoLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enable-background="new 0 0 24 24"
                  viewBox="0 0 24 24"
                  id="kakaotalk"
                >
                  <path
                    fill="#3e2723"
                    d="m12 1c-6.627 0-12 4.208-12 9.399 0 3.356 2.246 6.301 5.625 7.963-.184.63-1.181 4.051-1.221 4.32 0 0-.024.202.108.279s.286.017.286.017c.378-.052 4.378-2.844 5.07-3.328.692.097 1.404.148 2.131.148 6.627 0 12-4.208 12-9.399.001-5.191-5.372-9.399-11.999-9.399z"
                  ></path>
                  <g fill="#ffeb3b">
                    <path d="M12.04 12.598l-1.656-4.328c-.117-.33-.471-.669-.923-.679-.451.01-.805.349-.922.678l-1.656 4.33c-.21.649-.027.889.164.977.138.063.288.095.44.095.289 0 .509-.116.576-.303l.343-.892h2.111l.343.891c.067.187.287.304.576.304.152 0 .302-.032.44-.095.191-.087.374-.328.164-.978zm-3.27-1.341l.692-1.951.691 1.951zM6.058 13.023c0 .362-.311.657-.692.657s-.692-.295-.692-.657v-4.086h-1.08c-.375 0-.679-.302-.679-.673s.303-.674.678-.674h3.545c.375 0 .679.302.679.673s-.305.674-.679.674h-1.08zM15.375 13.579h-2.221c-.366 0-.663-.283-.663-.63v-4.671c0-.379.317-.688.707-.688s.707.308.707.688v4.04h1.471c.366 0 .663.283.663.63-.001.348-.298.631-.664.631zM20.794 13.061c-.025.181-.122.344-.269.454-.12.09-.266.139-.416.139-.218.001-.423-.1-.553-.273l-1.624-2.137-.24.239v1.5c0 .38-.31.688-.693.688-.382 0-.692-.308-.692-.688v-4.705c0-.379.31-.688.692-.688s.692.308.692.688v1.478l1.932-1.919c.099-.099.236-.153.384-.153.173 0 .346.074.476.203.121.12.194.275.204.436.01.162-.044.311-.153.419l-1.578 1.567 1.704 2.243c.113.145.161.329.134.509z"></path>
                  </g>
                </svg>
                카카오로 로그인
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  또는 이메일로 계속하기
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">비밀번호</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">로그인 중...</span>
                      <span className="sr-only">로딩 중</span>
                    </>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              아직 회원이 아니신가요?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
              >
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
