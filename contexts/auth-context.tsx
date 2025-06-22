"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  type AuthUser,
  getCurrentUser,
  signOut as authSignOut,
  signUp as authSignUp,
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import type { UserRole } from "@/types";
import { recoverSession } from "@/lib/supabase-client";

// AuthUser 타입 확장
interface ExtendedAuthUser extends AuthUser {
  role?: UserRole;
  status?: string;
}

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedAuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true); // 컴포넌트 마운트 상태 추적

  // 에러 초기화 함수
  const clearError = () => setError(null);

  // 초기 사용자 로드 및 인증 상태 변경 감지
  useEffect(() => {
    // 컴포넌트 마운트 시 플래그 설정
    isMountedRef.current = true;

    // 안전한 상태 업데이트 함수
    const safeSetState = (setter: any, value: any) => {
      if (isMountedRef.current) {
        setter(value);
      }
    };

    const fetchUser = async () => {
      try {
        if (!isMountedRef.current) return;

        safeSetState(setIsLoading, true);
        safeSetState(setError, null);

        // 타임아웃 설정 (15초)
        authCheckTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            safeSetState(setIsLoading, false);
            safeSetState(setUser, null);
            safeSetState(setError, "사용자 정보 로드 시간이 초과되었습니다.");
          }
        }, 15000);

        if (!isMountedRef.current) return;

        // 현재 사용자 정보 가져오기
        let currentUser = null;
        try {
          currentUser = await getCurrentUser();
        } catch (userError: any) {
          console.error("사용자 정보 가져오기 오류:", userError);
          safeSetState(
            setError,
            userError?.message ||
              "사용자 정보를 가져오는 중 오류가 발생했습니다."
          );
        }

        if (!isMountedRef.current) return;

        if (currentUser) {
          // 특정 관리자 이메일 목록 (임시 해결책)
          const adminEmails = ["suneunglab1@gmail.com", "admin@example.com"]; // 필요한 관리자 이메일 추가

          // 사용자 프로필 정보 가져오기 시도
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role, status")
              .eq("id", currentUser.id)
              .single();

            if (!isMountedRef.current) return;

            if (error) {
              console.warn("프로필 정보를 가져오는 중 오류:", error.message);
            }

            if (!error && data) {
              safeSetState(setUser, {
                ...currentUser,
                role: data.role || "user",
                status: data.status || "active",
              });
            } else {
              // 프로필 정보를 가져오는 데 실패했지만 이메일이 관리자 목록에 있는 경우
              if (adminEmails.includes(currentUser.email)) {
                safeSetState(setUser, {
                  ...currentUser,
                  role: "admin",
                  status: "active",
                });
              } else {
                console.warn(
                  "프로필 정보를 찾을 수 없음, 기본 사용자로 설정:",
                  currentUser
                );
                safeSetState(setUser, currentUser);
              }
            }
          } catch (profileError: any) {
            if (!isMountedRef.current) return;

            console.error("프로필 정보 조회 오류:", profileError);
            safeSetState(
              setError,
              profileError?.message ||
                "프로필 정보를 조회하는 중 오류가 발생했습니다."
            );

            // 프로필 조회 실패 시 이메일 기반으로 관리자 여부 결정 (임시 해결책)
            if (adminEmails.includes(currentUser.email)) {
              safeSetState(setUser, {
                ...currentUser,
                role: "admin",
                status: "active",
              });
            } else {
              safeSetState(setUser, currentUser);
            }
          }
        } else {
          safeSetState(setUser, null);
        }
      } catch (error: any) {
        if (!isMountedRef.current) return;

        console.error("Error fetching user:", error);
        safeSetState(setUser, null);
        safeSetState(
          setError,
          error?.message || "사용자 정보를 가져오는 중 오류가 발생했습니다."
        );
      } finally {
        // 타임아웃 제거
        if (authCheckTimeoutRef.current) {
          clearTimeout(authCheckTimeoutRef.current);
          authCheckTimeoutRef.current = null;
        }

        if (isMountedRef.current) {
          safeSetState(setIsLoading, false);
        }
      }
    };

    fetchUser();

    return () => {
      // 컴포넌트 언마운트 시 플래그 설정 및 리소스 정리
      isMountedRef.current = false;

      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
        authCheckTimeoutRef.current = null;
      }
    };
  }, []);

  // 회원가입 함수
  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await authSignUp(email, password, name);
      router.push("/auth/verify-email");
    } catch (error: any) {
      console.error("회원가입 오류:", error);
      setError(error?.message || "회원가입 중 오류가 발생했습니다.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    // 타임아웃 설정
    const loginTimeout = setTimeout(() => {
      console.error("로그인 타임아웃 발생");
      setIsLoading(false);
      const timeoutError = new Error(
        "로그인 요청이 시간 초과되었습니다. 다시 시도해주세요."
      );
      setError(timeoutError.message);
      throw timeoutError;
    }, 10000); // 10초 타임아웃

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 타임아웃 취소
      clearTimeout(loginTimeout);

      if (error) {
        console.log(error);
        console.error("로그인 오류:", error.message);
        setError(error.message);
        throw error;
      }

      // 사용자 프로필 정보 가져오기 시도
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("프로필 조회 오류:", profileError.message);
        }

        if (!profileError && profileData) {
          const userWithRole = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name,
            avatar_url: data.user.user_metadata?.avatar_url,
            role: profileData.role || "user",
            status: profileData.status || "active",
          };

          setUser(userWithRole);

          // 사용자 상태 확인
          if (profileData.status === "blocked") {
            const blockedError = new Error(
              "계정이 차단되었습니다. 관리자에게 문의하세요."
            );
            setError(blockedError.message);
            throw blockedError;
          }
        } else {
          // 프로필이 없는 경우 기본 사용자 정보 설정
          setUser({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name,
            avatar_url: data.user.user_metadata?.avatar_url,
            role: "user",
            status: "active",
          });
          router.push("/my-page");
        }
      } catch (profileError: any) {
        console.error("프로필 정보 조회 오류:", profileError);
        setError(
          profileError?.message ||
            "프로필 정보를 조회하는 중 오류가 발생했습니다."
        );

        // 프로필 조회 실패 시 기본 사용자 정보로 설정
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url,
          role: "user",
          status: "active",
        });

        router.push("/my-page");
      }
    } catch (error: any) {
      // 타임아웃 취소
      clearTimeout(loginTimeout);

      console.error("로그인 처리 중 오류:", error);
      setError(error?.message || "로그인 중 오류가 발생했습니다.");
      throw error;
    } finally {
      // 타임아웃 취소
      clearTimeout(loginTimeout);
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authSignOut();
      setUser(null);
      router.push("/");
    } catch (error: any) {
      console.error("로그아웃 오류:", error);
      setError(error?.message || "로그아웃 중 오류가 발생했습니다.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 관리자 여부 확인
  const isAdmin = Boolean(user?.role === "admin");

  // 비밀번호 재설정 이메일 전송
  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/my-page/settings?reset=true`,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("비밀번호 재설정 이메일 전송 오류:", error);
      setError(
        error?.message || "비밀번호 재설정 이메일 전송 중 오류가 발생했습니다."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 새 비밀번호로 업데이트
  const handleUpdatePassword = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("비밀번호 업데이트 오류:", error);
      setError(error?.message || "비밀번호 업데이트 중 오류가 발생했습니다.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 새로고침 함수
  const handleRefreshUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 현재 사용자 정보 가져오기
      let currentUser = null;
      try {
        currentUser = await getCurrentUser();
      } catch (userError: any) {
        console.error("사용자 정보 가져오기 오류:", userError);
        setError(userError?.message || "사용자 정보를 가져오는 중 오류가 발생했습니다.");
      }

      if (!currentUser) {
        setUser(null);
        return;
      }

      // 특정 관리자 이메일 목록 (임시 해결책)
      const adminEmails = ["suneunglab1@gmail.com", "admin@example.com"]; // 필요한 관리자 이메일 추가

      // 사용자 프로필 정보 가져오기 시도
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", currentUser.id)
          .single();

        if (error) {
          console.warn("프로필 정보를 가져오는 중 오류:", error.message);
        }

        if (!error && data) {
          setUser({
            ...currentUser,
            role: data.role || "user",
            status: data.status || "active",
          });
        } else {
          // 프로필 정보를 가져오는 데 실패했지만 이메일이 관리자 목록에 있는 경우
          if (adminEmails.includes(currentUser.email)) {
            setUser({
              ...currentUser,
              role: "admin",
              status: "active",
            });
          } else {
            console.warn(
              "프로필 정보를 찾을 수 없음, 기본 사용자로 설정:",
              currentUser
            );
            setUser(currentUser);
          }
        }
      } catch (profileError: any) {
        console.error("프로필 정보 조회 오류:", profileError);
        setError(
          profileError?.message ||
            "프로필 정보를 조회하는 중 오류가 발생했습니다."
        );

        // 프로필 조회 실패 시 기본 사용자 정보로 설정
        setUser({
          id: currentUser.id,
          email: currentUser.email || "",
          name: currentUser.user_metadata?.name,
          avatar_url: currentUser.user_metadata?.avatar_url,
          role: "user",
          status: "active",
        });
      }
    } catch (error: any) {
      console.error("사용자 정보 새로고침 중 오류:", error);
      setError(error?.message || "사용자 정보를 새로고침하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        setError,
        clearError,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAdmin,
        resetPassword: handleResetPassword,
        updatePassword: handleUpdatePassword,
        refreshUser: handleRefreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // 개발 환경에서만 에러를 콘솔에 출력
    if (process.env.NODE_ENV !== "production") {
      console.error("useAuth must be used within an AuthProvider");
    }
    // 기본값 반환
    return {
      user: null,
      isLoading: false,
      error: null,
      setError: () => {},
      clearError: () => {},
      signUp: async () => {
        throw new Error("Auth provider not available");
      },
      signIn: async () => {
        throw new Error("Auth provider not available");
      },
      signOut: async () => {
        throw new Error("Auth provider not available");
      },
      isAdmin: false,
      resetPassword: async () => {
        throw new Error("Auth provider not available");
      },
      updatePassword: async () => {
        throw new Error("Auth provider not available");
      },
      refreshUser: async () => {
        throw new Error("Auth provider not available");
      },
    };
  }
  return context;
}
