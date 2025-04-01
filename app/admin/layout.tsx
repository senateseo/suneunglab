"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Users, BookOpen, LayoutDashboard, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }) {
  const { user, isAdmin, isLoading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-2">인증 상태 확인 중...</p>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // 리디렉션이 발생할 것이므로 아무것도 렌더링하지 않음
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">접근 권한이 없습니다</p>
          <p className="mb-4">이 페이지는 관리자만 접근할 수 있습니다.</p>
          <Button asChild>
            <Link href="/my-page">내 페이지로 이동</Link>
          </Button>
        </div>
      </div>
    )
  }

  const navItems = [
    {
      title: "대시보드",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === "/admin/dashboard",
    },
    {
      title: "사용자 관리",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/admin/users",
    },
    {
      title: "강의 관리",
      href: "/admin/courses",
      icon: <BookOpen className="h-5 w-5" />,
      active: pathname === "/admin/courses" || pathname.startsWith("/admin/courses/"),
    },
    {
      title: "설정",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* 사이드바 */}
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link href="/admin/dashboard" className="flex items-center">
              <h1 className="font-bold text-xl">관리자 패널</h1>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* 모바일 상단 네비게이션 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin/dashboard" className="font-bold text-lg">
            관리자 패널
          </Link>
          <div className="flex items-center gap-2">{/* 모바일 메뉴 버튼 */}</div>
        </div>
        <div className="flex overflow-x-auto p-2 border-t">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap",
                item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 md:p-8 p-4 md:pt-8 pt-28 overflow-y-auto">{children}</main>
    </div>
  )
}

