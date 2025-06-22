"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateCourse, createCourse, getCourseModules, createModule } from "@/lib/admin"
import type { Course, Module } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function CourseEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params?.courseId as string
  // 명시적으로 문자열 비교를 통해 새 강의 여부 확인
  const isNewCourse = courseId === "new" || window.location.pathname.includes("/admin/courses/new")

  console.log("CourseEditPage 초기화:", { courseId, isNewCourse, path: window.location.pathname })

  const [course, setCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    long_description: "",
    category: "",
    level: "초급",
    duration: "",
    price: 0,
    image_url: "",
    published: false,
    instructor_id: "", // 실제로는 현재 로그인한 관리자 ID 또는 선택된 강사 ID로 설정
  })

  const [modules, setModules] = useState<Module[]>([])
  const [newModule, setNewModule] = useState({ title: "" })
  const [isLoading, setIsLoading] = useState(!isNewCourse)
  const [isSaving, setIsSaving] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    if (isNewCourse) {
      // 새 강의 생성 모드일 때는 로딩 상태 해제
      setIsLoading(false)

      // 현재 로그인한 사용자 ID를 instructor_id로 설정
      if (user?.id) {
        setCourse((prev) => ({
          ...prev,
          instructor_id: user.id,
        }))
      }
    } else {
      // 기존 강의 편집 모드
      fetchCourseData()
    }
  }, [courseId, isNewCourse, user])

  async function fetchCourseData() {
    try {
      setIsLoading(true)

      // courseId가 유효한 경우에만 getCourse 호출
      if (courseId && courseId !== "new") {
        // API를 통해 강의 정보 가져오기
        const response = await fetch(`/api/admin/courses/${courseId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "강의 정보를 가져오는 중 오류가 발생했습니다.")
        }

        const courseData = await response.json()

        if (courseData) {
          setCourse(courseData)

          // 모듈 데이터 설정
          if (courseData.modules) {
            setModules(courseData.modules)
          } else {
            // 별도로 모듈 데이터 가져오기
            const modulesData = await getCourseModules(courseId)
            setModules(modulesData)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error)
      toast({
        title: "오류 발생",
        description: "강의 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourse({ ...course, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setCourse({ ...course, [name]: value })
  }

  const handleSwitchChange = (name, checked) => {
    setCourse({ ...course, [name]: checked })
  }

  const handleAddModule = async () => {
    if (!newModule.title.trim()) {
      toast({
        title: "모듈 제목 필요",
        description: "모듈 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (isNewCourse) {
      toast({
        title: "강의 저장 필요",
        description: "먼저 강의를 저장한 후 모듈을 추가할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("모듈 추가 시도:", { courseId, title: newModule.title })

      const moduleData = {
        course_id: courseId,
        title: newModule.title,
        order: modules.length + 1,
      }

      console.log("모듈 생성 데이터:", moduleData)
      const newModuleData = await createModule(moduleData)
      console.log("생성된 모듈:", newModuleData)

      if (newModuleData) {
        setModules([...modules, newModuleData])
        setNewModule({ title: "" })

        toast({
          title: "모듈 추가 완료",
          description: "새 모듈이 성공적으로 추가되었습니다.",
        })
      }
    } catch (error) {
      console.error("Error adding module:", error)
      toast({
        title: "오류 발생",
        description: "모듈 추가 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"),
        variant: "destructive",
      })
    }
  }

  const handleCreateNewCourse = async () => {
    // 필수 필드 검증
    if (!course.title || !course.description || !course.category || !course.level || !course.duration) {
      toast({
        title: "필수 정보 누락",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      console.log("새 강의 생성 시도:", course)

      // 새 강의 생성 데이터 준비
      const courseData = {
        title: course.title,
        description: course.description,
        long_description: course.long_description || "",
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: Number(course.price) || 0,
        image_url: course.image_url || "",
        published: course.published || false,
        instructor_id: user?.id || "", // 현재 로그인한 사용자 ID 사용
      }

      if (!courseData.instructor_id) {
        throw new Error("강사 ID가 설정되지 않았습니다. 로그인 상태를 확인해주세요.")
      }

      console.log("새 강의 생성 데이터:", courseData)

      try {
        const savedCourse = await createCourse(courseData)
        console.log("생성된 강의:", savedCourse)

        toast({
          title: "강의 생성 완료",
          description: "새 강의가 성공적으로 생성되었습니다.",
        })

        // 새로 생성된 강의의 편집 페이지로 이동
        if (savedCourse && savedCourse.id) {
          router.push(`/admin/courses/${savedCourse.id}`)
        }
      } catch (apiError: any) {
        console.error("API 오류:", apiError)

        // RLS 정책 오류 처리
        if (apiError.message && apiError.message.includes("row-level security policy")) {
          toast({
            title: "권한 오류",
            description: "강의를 생성할 권한이 없습니다. 관리자 권한이 필요합니다.",
            variant: "destructive",
          })
        } else {
          throw apiError
        }
      }
    } catch (error: any) {
      console.error("Error creating course:", error)
      toast({
        title: "오류 발생",
        description: "강의 생성 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateCourse = async () => {
    // 필수 필드 검증
    if (!course.title || !course.description || !course.category || !course.level || !course.duration) {
      toast({
        title: "필수 정보 누락",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      console.log("기존 강의 업데이트 시도:", { courseId, course })

      // courseId 확인
      if (!courseId || courseId === "new") {
        throw new Error("유효하지 않은 강의 ID입니다.")
      }

      const courseData = {
        ...course,
        price: Number(course.price) || 0, // 숫자로 변환
      }

      console.log("강의 업데이트 데이터:", courseData)
      const savedCourse = await updateCourse(courseId, courseData)
      console.log("업데이트된 강의:", savedCourse)

      toast({
        title: "강의 업데이트 완료",
        description: "강의가 성공적으로 업데이트되었습니다.",
      })

      if (savedCourse) {
        setCourse(savedCourse)
      }
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "오류 발생",
        description: "강의 업데이트 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 새 강의 생성 또는 기존 강의 업데이트 처리
  const handleSaveCourse = async () => {
    console.log("handleSaveCourse 호출됨, isNewCourse:", isNewCourse)

    if (isNewCourse) {
      await handleCreateNewCourse()
    } else {
      await handleUpdateCourse()
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">강의 정보를 불러오는 중...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.push("/admin/courses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <h1 className="text-3xl font-bold">{isNewCourse ? "새 강의 생성" : "강의 편집"}</h1>
        </div>
        <Button onClick={handleSaveCourse} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "저장 중..." : isNewCourse ? "강의 생성" : "저장"}
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="content">강의 내용</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>강의의 기본 정보를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">강의 제목 *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={course.title}
                    onChange={handleInputChange}
                    placeholder="강의 제목을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select value={course.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="국어">국어</SelectItem>
                      <SelectItem value="수학">수학</SelectItem>
                      <SelectItem value="영어">영어</SelectItem>
                      <SelectItem value="과학탐구">과학탐구</SelectItem>
                      <SelectItem value="사회탐구">사회탐구</SelectItem>
                      <SelectItem value="종합">종합</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">난이도 *</Label>
                  <Select value={course.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="초급">초급</SelectItem>
                      <SelectItem value="중급">중급</SelectItem>
                      <SelectItem value="고급">고급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">기간 *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={course.duration}
                    onChange={handleInputChange}
                    placeholder="예: 8주"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">가격 (원) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={course.price}
                    onChange={handleInputChange}
                    placeholder="가격을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">이미지 URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={course.image_url || ""}
                    onChange={handleInputChange}
                    placeholder="이미지 URL을 입력하세요"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">간단한 설명 *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={course.description}
                  onChange={handleInputChange}
                  placeholder="강의에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">상세 설명</Label>
                <Textarea
                  id="long_description"
                  name="long_description"
                  value={course.long_description || ""}
                  onChange={handleInputChange}
                  placeholder="강의에 대한 상세 설명을 입력하세요"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>강의 내용</CardTitle>
              <CardDescription>강의 모듈과 강의를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">모듈</h3>

                {modules.length === 0 ? (
                  <div className="text-center py-8 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">아직 모듈이 없습니다. 새 모듈을 추가하세요.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">
                            모듈 {index + 1}: {module.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {/* 강의 수를 표시할 수 있음 */}
                            {module.lessons ? `${module.lessons.length}개 강의` : "0개 강의"}
                          </p>
                        </div>
                        <Button variant="outline" asChild>
                          <a href={`/admin/courses/${courseId}/modules/${module.id}`}>관리</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2 mt-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="new-module">새 모듈 추가</Label>
                    <Input
                      id="new-module"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ title: e.target.value })}
                      placeholder="모듈 제목을 입력하세요"
                    />
                  </div>
                  <Button onClick={handleAddModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>강의 설정</CardTitle>
              <CardDescription>강의 게시 상태 및 기타 설정을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">게시 상태</Label>
                  <p className="text-sm text-muted-foreground">강의를 학생들에게 공개할지 여부를 설정합니다.</p>
                </div>
                <Switch
                  id="published"
                  checked={course.published}
                  onCheckedChange={(checked) => handleSwitchChange("published", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveCourse} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "저장 중..." : isNewCourse ? "강의 생성" : "설정 저장"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

