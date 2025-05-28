"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, Key } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SettingsPage() {
  const { user, signOut, isLoading, resetPassword, updatePassword } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // URL 파라미터로 reset=true가 오면 비밀번호 재설정 다이얼로그 표시
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      setShowUpdateDialog(true);
    }
  }, [searchParams]);

  const handleResetPassword = async () => {
    setShowResetDialog(false);
    setShowUpdateDialog(true);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword(newPassword);
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
      setShowUpdateDialog(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "비밀번호 변경 실패",
        description: error.message || "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      toast({
        title: "로그아웃 성공",
        description: "성공적으로 로그아웃되었습니다.",
      });
    } catch (error: any) {
      toast({
        title: "로그아웃 실패",
        description: error.message || "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 로딩 중이거나 사용자가 없는 경우 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-8 space-y-4">
        <p>로그인이 필요합니다.</p>
        <Button asChild>
          <Link href="/auth/login">로그인하러 가기</Link>
        </Button>
      </div>
    );
  }

  // 가입일 포맷팅 (예시)
  const joinedDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">설정</h1>
        <p className="text-muted-foreground">계정 설정 및 환경설정 관리</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>일반 정보</CardTitle>
          <CardDescription>개인 정보 및 계정 세부 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                이름
              </h3>
              <p className="font-medium">{user.name || "이름 미설정"}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                이메일
              </h3>
              <p className="font-medium">{user.email}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                가입일
              </h3>
              <p className="font-medium">{joinedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            비밀번호 관리
          </CardTitle>
          <CardDescription>비밀번호 변경 및 재설정</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">비밀번호 재설정</h3>
              <p className="text-sm text-muted-foreground">
                새로운 비밀번호로 재설정합니다
              </p>
            </div>
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">비밀번호 재설정</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>비밀번호 재설정</DialogTitle>
                  <DialogDescription>
                    새로운 비밀번호로 재설정합니다
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowResetDialog(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? "전송 중..." : "비밀번호 변경"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 비밀번호 설정</DialogTitle>
            <DialogDescription>
              새로운 비밀번호를 입력해주세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUpdateDialog(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            계정 작업
          </CardTitle>
          <CardDescription>확인이 필요한 계정 관련 작업</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">계정에서 로그아웃</h3>
              <p className="text-sm text-muted-foreground">
                모든 기기에서 로그아웃됩니다
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
