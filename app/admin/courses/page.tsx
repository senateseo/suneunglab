"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Plus, Pencil, Trash2, Eye, BookOpen } from "lucide-react"
import { deleteCourse } from "@/lib/admin"
import type { Course } from "@/types"
import { useToast } from "@/components/ui/use-toast"
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredCourses(
        courses.filter(
          (course) =>
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.category.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, courses])

  async function fetchCourses() {
    try {
      setIsLoading(true)
      console.log("관리자 페이지: 강의 목록 가져오기 시작")

      // 서버 API를 통해 강의 목록 가져오기
      const response = await fetch("/api/admin/courses-list")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "강의 목록을 가져오는 중 오류가 발생했습니다.")
      }

      const data = await response.json()
      console.log("관리자 페이지: 강의 목록 가져오기 성공", data)

      if (!data || data.length === 0) {
        toast({
          title: "강의 없음",
          description: "등록된 강의가 없습니다. 새 강의를 추가해보세요.",
        })
      }

      setCourses(data || [])
      setFilteredCourses(data || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "오류 발생",
        description: "강의 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })

      // 오류 발생 시 빈 배열 설정
      setCourses([])
      setFilteredCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteCourse() {
    if (!courseToDelete) return

    try {
      await deleteCourse(courseToDelete)

      // 강의 삭제 후 목록 갱신
      setCourses(courses.filter((course) => course.id !== courseToDelete))
      setFilteredCourses(filteredCourses.filter((course) => course.id !== courseToDelete))

      toast({
        title: "강의 삭제 완료",
        description: "강의가 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "오류 발생",
        description: "강의 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCourseToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">강의 관리</h1>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />새 강의 추가
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>강의 목록</CardTitle>
          <CardDescription>시스템에 등록된 모든 강의를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="제목, 설명 또는 카테고리로 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">강의 목록을 불러오는 중...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>레벨</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[120px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        강의를 찾을 수 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.level}</TableCell>
                        <TableCell>₩{Math.round(course.price * 1350).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={course.published ? "success" : "outline"}>
                            {course.published ? "게시됨" : "초안"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">메뉴 열기</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/courses/${course.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>미리보기</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/courses/${course.id}/lectures`}>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  <span>강의 페이지</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/edit/${course.id}`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>편집</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setCourseToDelete(course.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>삭제</span>
                              </DropdownMenuItem>
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

      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>강의를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 강의와 관련된 모든 데이터가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

