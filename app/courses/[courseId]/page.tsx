"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  MessageSquare,
  Award,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../contexts/auth-context";

export default function CoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // 사용자가 로그인한 상태일 때 enrollment 상태를 확인
  useEffect(() => {
    if (user && courseId) {
      checkEnrollmentStatus();
    } else {
      setIsEnrolled(false);
    }
  }, [user, courseId]);

  // 페이지가 다시 포커스를 받을 때 enrollment 상태 재확인 (결제 후 돌아올 때)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && courseId) {
        checkEnrollmentStatus();
      }
    };

    const handleFocus = () => {
      if (user && courseId) {
        checkEnrollmentStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, courseId]);

  // 실시간 enrollment 상태 확인
  const checkEnrollmentStatus = async () => {
    if (!user) return;
    
    try {
      setIsCheckingEnrollment(true);
      const response = await fetch(`/api/users/enrollments?userId=${user.id}`);
      
      if (response.ok) {
        const enrollments = await response.json();
        const enrolled = enrollments.some((enrollment: any) => enrollment.id === courseId);
        setIsEnrolled(enrolled);
      } else {
        // API 호출이 실패한 경우 fallback으로 user.enrollments 사용
        setIsEnrolled(
          user.enrollments?.some(
            (enrollment: any) => enrollment.course_id === courseId
          ) || false
        );
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      // 에러 발생 시 fallback으로 user.enrollments 사용
      setIsEnrolled(
        user.enrollments?.some(
          (enrollment: any) => enrollment.course_id === courseId
        ) || false
      );
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  const handleClickEnroll = () => {
    if (user) {
      if(isEnrolled) {
        router.push(`/courses/${courseId}/lectures`);
      } else {
        // Payment page
        router.push(`/payment?courseId=${courseId}`);
      }
    } else {
      router.push(`/auth/login`);
    }
  };

  async function fetchCourse() {
    try {
      setIsLoading(true);

      // 서버 API를 통해 강의 상세 정보 가져오기
      const response = await fetch(`/api/admin/courses/${courseId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "강의 정보를 가져오는 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();

      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        title: "오류 발생",
        description: "강의 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        강의를 찾을 수 없습니다
      </div>
    );
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

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 whitespace-pre-wrap">
                {course.long_description || course.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* <div className="flex items-center gap-4 mb-8">
                <img
                  src={
                    course.instructor.avatar ||
                    "/placeholder.svg?height=100&width=100"
                  }
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor.title}
                  </p>
                </div>
              </div> */}
            </div>

            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="content">강의 내용</TabsTrigger>
                <TabsTrigger value="overview">수강대상</TabsTrigger>
                {/* <TabsTrigger value="discussion">리뷰</TabsTrigger> */}
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module: any, index: number) => (
                    <Card key={module.id || index}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          {module.title}
                        </h3>
                        <div className="space-y-3">
                          {module.lessons && module.lessons.length > 0 ? (
                            module.lessons.map((lesson: any, lessonIndex: number) => (
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
                                  <span className="text-sm text-muted-foreground">
                                    {lesson.duration}
                                  </span>
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
                      <p className="text-muted-foreground">
                        이 강의에는 아직 모듈이 없습니다.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">추천 수강대상</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn?.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="my-8"></div>
                    <h3 className="text-xl font-semibold mb-4">이런 학생은 듣지 마세요</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {["작년 수능 기준 1등급 나오는 학생", "이미 방향성을 잡고 열심히 공부하고 있는 학생"].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <X className="h-5 w-5 text-primary mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {/* 
                    <h3 className="text-xl font-semibold mt-8 mb-4">
                      강사 소개
                    </h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          course.instructor.avatar ||
                          "/placeholder.svg?height=100&width=100"
                        }
                        alt={course.instructor.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium">
                          {course.instructor.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.instructor.title}
                        </p>
                        <p>{course.instructor.bio}</p>
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="discussion">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MessageSquare className="h-5 w-5" />
                      <h3 className="text-xl font-semibold">토론 포럼</h3>
                    </div>

                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        토론에 참여하려면 이 강의에 등록해야 합니다.
                      </p>
                      <Button>토론 참여를 위해 등록하기</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="overflow-hidden">
                <img
                  src={
                    course.image_url || "/placeholder.svg?height=400&width=800"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-2">
                      {course.price
                        ? `₩${Math.round(course.price).toLocaleString()}`
                        : "무료"}
                    </div>
                    <p className="text-muted-foreground">
                      이 강의에 대한 전체 액세스
                    </p>
                  </div>

                  <Button size="lg" className="w-full mb-4" disabled={isCheckingEnrollment}>
                    {isEnrolled ? (
                      <Link href={`/courses/${courseId}/lectures`}>
                        <BookOpen className="mr-2 h-4 w-4" /> 강의 보기
                      </Link>
                    ) : (
                      <Button onClick={handleClickEnroll} disabled={isCheckingEnrollment}>
                        <BookOpen className="mr-2 h-4 w-4" /> 
                        {isCheckingEnrollment ? "확인 중..." : "수강하러 가기"}
                      </Button>
                    )}
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-4">이 강의에 포함된 내용:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        <span>
                          {course.modules?.reduce(
                            (total: number, module: any) =>
                              total +
                              (module.lessons?.filter((l: any) => l.type === "video")
                                .length || 0),
                            0
                          ) || "다수"}
                          개의 비디오 강의
                        </span>
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
              <h3 className="font-semibold text-lg mr-4 truncate max-w-[200px] md:max-w-md">
                {course.title}
              </h3>
              <div className="hidden md:flex items-center gap-4">
                <Badge variant="outline">{course.level}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">

            <a
                href="http://pf.kakao.com/_bQSJn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 gap-2 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-md flex items-center justify-center shadow-lg transition-all duration-200"
                aria-label="카카오 채널 문의하기"
              >
           
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black"
              >
                <path
                  d="M12 3C7.029 3 3 6.336 3 10.5c0 2.616 1.696 4.906 4.256 6.227L6.023 20l4.181-2.213C10.796 17.929 11.387 18 12 18c4.971 0 9-3.336 9-7.5S16.971 3 12 3z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs md:text-sm text-black font-semibold">문의하기</span>
            </a>
              
            <Button disabled={isCheckingEnrollment}>
              {isEnrolled ? (
                <Link href={`/courses/${courseId}/lectures`} className="text-xs md:text-sm">
                  <BookOpen className="mr-2 h-4 w-4" /> 강의 보기
                </Link>
              ) : (
                <Button onClick={handleClickEnroll} className="text-xs md:text-sm" disabled={isCheckingEnrollment}>
                  <BookOpen className="mr-2 h-4 w-4" /> 
                  {isCheckingEnrollment ? "확인 중..." : "수강하러 가기"}
                </Button>
              )}
            </Button>
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
