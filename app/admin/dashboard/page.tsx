"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllUsers, getAllCourses } from "@/lib/admin"
import { Users, BookOpen, UserCheck, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)

        // 각 API 호출을 개별적으로 처리하여 하나가 실패해도 다른 하나는 계속 진행
        let users = []
        let courses = []

        try {
          users = await getAllUsers()
        } catch (error) {
          console.error("사용자 목록 조회 오류:", error)
          toast({
            title: "사용자 데이터 로드 실패",
            description: "사용자 정보를 불러오는 중 오류가 발생했습니다. 임시 데이터를 사용합니다.",
            variant: "destructive",
          })

          // 임시 사용자 데이터
          users = [
            {
              id: "1",
              email: "admin@example.com",
              name: "관리자",
              role: "admin",
              status: "active",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              email: "user1@example.com",
              name: "사용자1",
              role: "user",
              status: "active",
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              email: "user2@example.com",
              name: "사용자2",
              role: "user",
              status: "blocked",
              created_at: new Date().toISOString(),
            },
          ]
        }

        try {
          courses = await getAllCourses()
        } catch (error) {
          console.error("강의 목록 조회 오류:", error)
          toast({
            title: "강의 데이터 로드 실패",
            description: "강의 정보를 불러오는 중 오류가 발생했습니다. 임시 데이터를 사용합니다.",
            variant: "destructive",
          })

          // 임시 강의 데이터
          courses = []
        }

        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          activeUsers: users.filter((user) => user.status === "active").length,
        })
      } catch (error) {
        console.error("통계 데이터 로드 오류:", error)
        toast({
          title: "통계 데이터 로드 실패",
          description: "통계 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })

        // 기본 통계 데이터 설정
        setStats({
          totalUsers: 0,
          totalCourses: 0,
          activeUsers: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="총 사용자"
          value={stats.totalUsers}
          description="등록된 총 사용자 수"
          icon={<Users className="h-5 w-5 text-primary" />}
          isLoading={isLoading}
        />
        <StatCard
          title="활성 사용자"
          value={stats.activeUsers}
          description="활성 상태의 사용자 수"
          icon={<UserCheck className="h-5 w-5 text-primary" />}
          isLoading={isLoading}
        />
        <StatCard
          title="총 강의"
          value={stats.totalCourses}
          description="등록된 총 강의 수"
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          isLoading={isLoading}
        />
        <StatCard
          title="최근 활동"
          value="오늘"
          description="마지막 시스템 업데이트"
          icon={<Clock className="h-5 w-5 text-primary" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템의 최근 활동 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <p className="text-sm text-muted-foreground">오늘</p>
                <p className="font-medium">새로운 사용자 3명이 가입했습니다.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <p className="text-sm text-muted-foreground">어제</p>
                <p className="font-medium">새로운 강의 '수능 영어 독해 전략'이 추가되었습니다.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <p className="text-sm text-muted-foreground">3일 전</p>
                <p className="font-medium">시스템 업데이트가 완료되었습니다.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
            <CardDescription>자주 사용하는 관리 작업</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                title="사용자 관리"
                description="사용자 계정 관리"
                href="/admin/users"
                icon={<Users className="h-8 w-8 text-primary" />}
              />
              <QuickActionCard
                title="강의 관리"
                description="강의 생성 및 수정"
                href="/admin/courses"
                icon={<BookOpen className="h-8 w-8 text-primary" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, description, icon, isLoading }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ title, description, href, icon }) {
  return (
    <a href={href} className="block">
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2">{icon}</div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </a>
  )
}

