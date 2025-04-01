"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, BookOpen, CheckCircle2, PlayCircle, FileText, MessageSquare, Award } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  async function fetchCourse() {
    try {
      setIsLoading(true)
      console.log("코스 상세 페이지: 강의 정보 가져오기 시작", { courseId })

      // 서버 API를 통해 강의 상세 정보 가져오기
      const response = await fetch(`/api/admin/courses/${courseId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "강의 정보를 가져오는 중 오류가 발생했습니다.")
      }

      const data = await response.json()
      console.log("코스 상세 페이지: 강의 정보 가져오기 성공", data)

      setCourse(data)
    } catch (error) {
      console.error("Error fetching course:", error)
      toast({
        title: "오류 발생",
        description: "강의 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-full max-w-2xl bg-muted rounded mb-8"></div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-8 w-full bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return <div className="container mx-auto px-4 py-12">강의를 찾을 수 없습니다</div>
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge>{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.long_description || course.description}</p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{(course.enrolled || 0).toLocaleString()}명 수강 중</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span>수료증 발급</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <img
                  src={course.instructor.avatar || "/placeholder.svg?height=100&width=100"}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="content">강의 내용</TabsTrigger>
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="discussion">토론</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, index) => (
                    <Card key={module.id || index}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          모듈 {index + 1}: {module.title}
                        </h3>
                        <div className="space-y-3">
                          {module.lessons && module.lessons.length > 0 ? (
                            module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.type === "video" ? (
                                    <PlayCircle className="h-5 w-5 text-primary" />
                                  ) : lesson.type === "assignment" ? (
                                    <FileText className="h-5 w-5 text-primary" />
                                  ) : (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  )}
                                  <span>{lesson.title}</span>
                                </div>
                                {lesson.duration && (
                                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-2 text-muted-foreground">
                              이 모듈에는 아직 강의가 없습니다.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">이 강의에는 아직 모듈이 없습니다.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">학습 내용</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold mt-8 mb-4">강사 소개</h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={course.instructor.avatar || "/placeholder.svg?height=100&width=100"}
                        alt={course.instructor.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium">{course.instructor.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
                        <p>{course.instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MessageSquare className="h-5 w-5" />
                      <h3 className="text-xl font-semibold">토론 포럼</h3>
                    </div>

                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">토론에 참여하려면 이 강의에 등록해야 합니다.</p>
                      <Button>토론 참여를 위해 등록하기</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="overflow-hidden">
                <img
                  src={course.image_url || "/placeholder.svg?height=400&width=800"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-2">
                      {course.price ? `₩${Math.round(course.price * 1350).toLocaleString()}` : "무료"}
                    </div>
                    <p className="text-muted-foreground">이 강의에 대한 전체 액세스</p>
                  </div>

                  <Button size="lg" className="w-full mb-4" asChild>
                    <Link href={`/payment?courseId=${course.id}`}>
                      <BookOpen className="mr-2 h-4 w-4" /> 지금 등록하기
                    </Link>
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-4">이 강의에 포함된 내용:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        <span>
                          {course.modules.reduce(
                            (total, module) => total + (module.lessons?.filter((l) => l.type === "video").length || 0),
                            0,
                          ) || "다수"}
                          개의 비디오 강의
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {course.modules.reduce(
                            (total, module) =>
                              total + (module.lessons?.filter((l) => l.type === "assignment").length || 0),
                            0,
                          ) || "다수"}
                          개의 과제
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          {course.modules.reduce(
                            (total, module) => total + (module.lessons?.filter((l) => l.type === "quiz").length || 0),
                            0,
                          ) || "다수"}
                          개의 퀴즈
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>토론 포럼 접근</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>수료증</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating bottom bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full px-4">
        <div className="max-w-7xl mx-auto bg-background border rounded-lg shadow-md py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg mr-4 truncate max-w-[200px] md:max-w-md">{course.title}</h3>
              <div className="hidden md:flex items-center gap-4">
                <Badge variant="outline">{course.level}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href={`/payment?courseId=${course.id}`}>
                <BookOpen className="mr-2 h-4 w-4" /> 지금 등록하기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

