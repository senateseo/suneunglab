"use client"

import { useState, useEffect } from "react"
import { getAllUsers, updateUserStatus, updateUserRole } from "@/lib/admin"
import type { User as UserType } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, MoreHorizontal, Shield, ShieldAlert, UserCheck, UserX } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [actionType, setActionType] = useState<"block" | "unblock" | "makeAdmin" | "removeAdmin" | null>(null)
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            (user.name?.toLowerCase() || "").includes(query) ||
            (user.email?.toLowerCase() || "").includes(query) ||
            (user.role?.toLowerCase() || "").includes(query) ||
            (user.status?.toLowerCase() || "").includes(query),
        ),
      )
    }
  }, [searchQuery, users])

  async function fetchUsers() {
    try {
      setIsLoading(true)
      const data = await getAllUsers()
      console.log("서버에서 받은 사용자 데이터:", data)

      if (data.length === 0) {
        // 사용자 목록을 가져오지 못한 경우 임시 데이터 사용
        const mockUsers: UserType[] = [
          {
            id: currentUser?.id || "eb22e17a-d715-42e4-ac27-254016bcce7d",
            email: currentUser?.email || "admin@example.com",
            name: currentUser?.name || "관리자",
            role: "admin",
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "fb33e18b-e826-53f5-bd38-365127cddf8e",
            email: "student1@example.com",
            name: "홍길동",
            role: "user",
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "ac44f29c-f937-64g6-ce49-476238deeg9f",
            email: "student2@example.com",
            name: "김철수",
            role: "user",
            status: "blocked",
            created_at: new Date().toISOString(),
          },
        ]

        setUsers(mockUsers)
        setFilteredUsers(mockUsers)

        toast({
          title: "임시 데이터 사용",
          description: "RLS 정책 문제로 인해 임시 데이터를 표시합니다.",
          variant: "warning",
        })
      } else {
        // 각 사용자 데이터 처리 및 디버깅
        const processedData = data.map((user) => {
          console.log("사용자 데이터 처리:", user)

          // 현재 로그인한 사용자의 이메일 정보 사용
          if (currentUser && user.id === currentUser.id) {
            console.log("현재 사용자 이메일 사용:", currentUser.email)
            user.email = currentUser.email
          }

          return {
            ...user,
            email: user.email || "이메일 없음",
            role: user.role || "user",
            status: user.status || "active",
            created_at: user.created_at || new Date().toISOString(),
          }
        })

        console.log("처리된 사용자 데이터:", processedData)
        setUsers(processedData)
        setFilteredUsers(processedData)
      }
    } catch (error) {
      console.error("Error fetching users:", error)

      // 오류 발생 시 임시 데이터 사용
      const mockUsers: UserType[] = [
        {
          id: currentUser?.id || "eb22e17a-d715-42e4-ac27-254016bcce7d",
          email: currentUser?.email || "admin@example.com",
          name: currentUser?.name || "관리자",
          role: "admin",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "fb33e18b-e826-53f5-bd38-365127cddf8e",
          email: "student1@example.com",
          name: "홍길동",
          role: "user",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "ac44f29c-f937-64g6-ce49-476238deeg9f",
          email: "student2@example.com",
          name: "김철수",
          role: "user",
          status: "blocked",
          created_at: new Date().toISOString(),
        },
      ]

      setUsers(mockUsers)
      setFilteredUsers(mockUsers)

      toast({
        title: "오류 발생",
        description: "사용자 목록을 불러오는 중 오류가 발생했습니다. 임시 데이터를 표시합니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedUser || !actionType) return

    try {
      switch (actionType) {
        case "block":
          await updateUserStatus(selectedUser.id, "blocked")
          toast({
            title: "사용자 차단됨",
            description: `${selectedUser.name || selectedUser.email} 사용자가 차단되었습니다.`,
          })
          // 상태 업데이트
          setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, status: "blocked" } : user)))
          break
        case "unblock":
          await updateUserStatus(selectedUser.id, "active")
          toast({
            title: "사용자 활성화됨",
            description: `${selectedUser.name || selectedUser.email} 사용자가 활성화되었습니다.`,
          })
          // 상태 업데이트
          setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, status: "active" } : user)))
          break
        case "makeAdmin":
          await updateUserRole(selectedUser.id, "admin")
          toast({
            title: "관리자 권한 부여됨",
            description: `${selectedUser.name || selectedUser.email} 사용자에게 관리자 권한이 부여되었습니다.`,
          })
          // 상태 업데이트
          setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: "admin" } : user)))
          break
        case "removeAdmin":
          await updateUserRole(selectedUser.id, "user")
          toast({
            title: "관리자 권한 제거됨",
            description: `${selectedUser.name || selectedUser.email} 사용자의 관리자 권한이 제거되었습니다.`,
          })
          // 상태 업데이트
          setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: "user" } : user)))
          break
      }
    } catch (error) {
      console.error(`Error performing action ${actionType}:`, error)
      toast({
        title: "작업 실패",
        description: "사용자 상태를 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSelectedUser(null)
      setActionType(null)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "날짜 정보 없음"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("날짜 형식 오류:", error)
      return "날짜 형식 오류"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">사용자 관리</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
          <CardDescription>시스템에 등록된 모든 사용자를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름, 이메일, 역할 또는 상태로 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">사용자 목록을 불러오는 중...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        사용자를 찾을 수 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || "이름 없음"}</TableCell>
                        <TableCell>{user.email || "이메일 없음"}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "outline"}>
                            {user.role === "admin" ? "관리자" : "사용자"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : "destructive"}>
                            {user.status === "active" ? "활성" : user.status === "blocked" ? "차단됨" : "상태 없음"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">메뉴 열기</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setActionType("block")
                                  }}
                                  className="text-destructive"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  <span>사용자 차단</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setActionType("unblock")
                                  }}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  <span>차단 해제</span>
                                </DropdownMenuItem>
                              )}

                              {user.role === "admin" ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setActionType("removeAdmin")
                                  }}
                                >
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                  <span>관리자 권한 제거</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setActionType("makeAdmin")
                                  }}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  <span>관리자로 설정</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 사용자 차단/활성화 확인 대화상자 */}
      <AlertDialog
        open={!!selectedUser && !!actionType}
        onOpenChange={() => {
          setSelectedUser(null)
          setActionType(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "block" && "사용자를 차단하시겠습니까?"}
              {actionType === "unblock" && "사용자 차단을 해제하시겠습니까?"}
              {actionType === "makeAdmin" && "관리자 권한을 부여하시겠습니까?"}
              {actionType === "removeAdmin" && "관리자 권한을 제거하시겠습니까?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "block" && "차단된 사용자는 로그인할 수 없습니다."}
              {actionType === "unblock" && "차단 해제된 사용자는 다시 로그인할 수 있습니다."}
              {actionType === "makeAdmin" && "관리자는 시스템의 모든 기능에 접근할 수 있습니다."}
              {actionType === "removeAdmin" && "관리자 권한이 제거되면 일반 사용자로 변경됩니다."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                actionType === "block" || actionType === "removeAdmin"
                  ? "bg-destructive text-destructive-foreground"
                  : ""
              }
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

