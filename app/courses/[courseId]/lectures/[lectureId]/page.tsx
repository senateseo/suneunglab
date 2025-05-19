"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  FileText,
  PlayCircle,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

// 강의 데이터 모델
interface Lecture {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration?: string;
  type: "video" | "assignment" | "quiz";
  completed?: boolean;
  notes?: string;
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
}

// 모듈 데이터 모델
interface Module {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

// 코스 데이터 모델
interface Course {
  id: string;
  title: string;
  description: string;
  progress?: number;
  modules: Module[];
}

// YouTube 비디오 URL을 임베드 URL로 변환하는 함수
function getVideoEmbedUrl(url?: string): string {
  if (!url) return "";

  // 이미 임베드 URL인 경우 그대로 반환
  if (url.includes("embed")) {
    return url;
  }

  // YouTube URL 처리
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    // YouTube 비디오 ID 추출
    let videoId = "";

    // youtube.com/watch?v=VIDEO_ID 형식
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    // youtu.be/VIDEO_ID 형식
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }

    // ID를 찾지 못한 경우 원래 URL 반환
    if (!videoId) {
      return url;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo URL 처리
  if (url.includes("vimeo.com")) {
    // Vimeo 비디오 ID 추출
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }

  // 지원하지 않는 형식이면 원래 URL 반환
  return url;
}

// 현재 강의와 이전/다음 강의를 찾는 함수
function findLectureContext(course: Course, lectureId: string) {
  let currentLecture: Lecture | null = null;
  let prevLecture: Lecture | null = null;
  let nextLecture: Lecture | null = null;
  let moduleIndex = -1;
  let lectureIndex = -1;

  // 모든 강의를 평면화된 배열로 변환
  const allLectures: Lecture[] = [];
  course.modules.forEach((module, mIdx) => {
    module.lectures.forEach((lecture) => {
      allLectures.push({
        ...lecture,
        moduleIndex: mIdx,
      } as Lecture & { moduleIndex: number });
    });
  });

  // 현재 강의의 인덱스 찾기
  const currentIndex = allLectures.findIndex(
    (lecture) => lecture.id === lectureId
  );

  if (currentIndex !== -1) {
    currentLecture = allLectures[currentIndex];
    if (currentIndex > 0) {
      prevLecture = allLectures[currentIndex - 1];
    }
    if (currentIndex < allLectures.length - 1) {
      nextLecture = allLectures[currentIndex + 1];
    }

    // 모듈 및 강의 인덱스 찾기
    for (let i = 0; i < course.modules.length; i++) {
      const lectureIdx = course.modules[i].lectures.findIndex(
        (lecture) => lecture.id === lectureId
      );
      if (lectureIdx !== -1) {
        moduleIndex = i;
        lectureIndex = lectureIdx;
        break;
      }
    }
  }

  return {
    currentLecture,
    prevLecture,
    nextLecture,
    moduleIndex,
    lectureIndex,
  };
}

export default function LecturePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;
  const isMobile = useMobile();
  const { toast } = useToast();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lectureProgress, setLectureProgress] = useState<
    Record<string, boolean>
  >({});

  // 사이드바 토글
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 모바일 화면 크기 변경 시 사이드바 상태 업데이트
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // 실제 API에서 강의 데이터 가져오기
  useEffect(() => {
    async function fetchCourseData() {
      try {
        setIsLoading(true);
        console.log("강의 페이지: 강의 정보 가져오기 시작", { courseId });
        console.log("강의 페이지: API 호출 시작", {
          courseApiUrl: `/api/courses/${courseId}`,
          modulesApiUrl: `/api/courses/${courseId}/modules`,
        });

        // 강의 정보 가져오기
        const response = await fetch(`/api/courses/${courseId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "강의 정보를 가져오는 중 오류가 발생했습니다."
          );
        }

        const courseData = await response.json();
        console.log("강의 페이지: 강의 정보 가져오기 성공", courseData);
        console.log("강의 페이지: 강의 정보 응답", { status: response.status });

        // 모듈 정보 가져오기
        const modulesResponse = await fetch(`/api/courses/${courseId}/modules`);

        if (!modulesResponse.ok) {
          const errorData = await modulesResponse.json();
          throw new Error(
            errorData.error || "모듈 정보를 가져오는 중 오류가 발생했습니다."
          );
        }

        const modulesData = await modulesResponse.json();
        console.log("강의 페이지: 모듈 정보 가져오기 성공", modulesData);
        console.log("강의 페이지: 모듈 정보 응답", {
          status: modulesResponse.status,
        });

        // 각 모듈의 강의 정보 가져오기
        const modulesWithLectures = await Promise.all(
          modulesData.map(async (module: Module) => {
            const lecturesResponse = await fetch(
              `/api/modules/${module.id}/lectures`
            );

            if (!lecturesResponse.ok) {
              console.error(
                `모듈 ${module.id}의 강의 정보를 가져오는 중 오류가 발생했습니다.`
              );
              return { ...module, lectures: [] };
            }

            const lecturesData = await lecturesResponse.json();
            return { ...module, lectures: lecturesData };
          })
        );

        // 강의 진행 상황 가져오기 (로그인한 경우)
        let progressData = {};
        if (user) {
          try {
            const progressResponse = await fetch(
              `/api/users/progress?courseId=${courseId}&userId=${user.id}`
            );
            if (progressResponse.ok) {
              const progress = await progressResponse.json();
              progressData = progress.reduce(
                (acc: Record<string, boolean>, item: any) => {
                  acc[item.lecture_id] = item.completed;
                  return acc;
                },
                {}
              );
              console.log("강의 진행 상황:", progressData);
            }
          } catch (error) {
            console.error(
              "강의 진행 상황을 가져오는 중 오류가 발생했습니다:",
              error
            );
          }
        }

        // 강의 데이터 설정
        setCourse({
          ...courseData,
          modules: modulesWithLectures.sort((a, b) => a.order - b.order),
        });

        setLectureProgress(progressData);
      } catch (error: any) {
        console.error("Error fetching course data:", error);

        // 더 자세한 오류 정보 로깅
        if (error.response) {
          console.error("API 응답 오류:", {
            status: error.response.status,
            data: error.response.data,
          });
        }

        toast({
          title: "오류 발생",
          description:
            "강의 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });

        // 오류 발생 시 이전 페이지로 이동하지 않고 오류 메시지 표시
        setIsLoading(false);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseData();
  }, [courseId, user, toast, router]);

  // 강의 완료 상태 토글
  const toggleLectureCompletion = async () => {
    if (!course || !user) return;

    const { moduleIndex, lectureIndex } = findLectureContext(course, lectureId);
    if (moduleIndex === -1 || lectureIndex === -1) return;

    const module = course.modules[moduleIndex];
    const lecture = module.lectures[lectureIndex];

    // 현재 완료 상태
    const isCompleted = lectureProgress[lectureId];

    try {
      // API 호출하여 강의 완료 상태 업데이트
      const response = await fetch("/api/users/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lectureId,
          completed: !isCompleted,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "강의 완료 상태를 업데이트하는 중 오류가 발생했습니다."
        );
      }

      // 상태 업데이트
      setLectureProgress({
        ...lectureProgress,
        [lectureId]: !isCompleted,
      });

      toast({
        title: !isCompleted ? "강의 완료" : "강의 미완료",
        description: !isCompleted
          ? "강의를 완료했습니다."
          : "강의를 미완료 상태로 변경했습니다.",
      });
    } catch (error) {
      console.error("Error updating lecture completion:", error);
      toast({
        title: "오류 발생",
        description: "강의 완료 상태를 업데이트하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-2">강의 정보를 불러오는 중...</p>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">강의를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              요청하신 강의를 찾을 수 없습니다.
            </p>
            <Button asChild className="w-full">
              <Link href="/courses">강의 목록으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { currentLecture, prevLecture, nextLecture, moduleIndex } =
    findLectureContext(course, lectureId);

  // 현재 강의가 없으면 오류 메시지 표시
  if (!currentLecture) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">강의를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              요청하신 강의를 찾을 수 없습니다. 다른 강의를 선택해주세요.
            </p>
            <Button asChild className="w-full">
              <Link href={`/courses/${courseId}`}>강의 목록으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 비디오 임베드 URL 가져오기
  const embedUrl = getVideoEmbedUrl(currentLecture.video_url);

  // 현재 강의의 완료 상태
  const isCompleted = lectureProgress[lectureId] || false;

  // 전체 강의 수와 완료된 강의 수 계산
  const totalLectures = course.modules.reduce(
    (total, module) => total + module.lectures.length,
    0
  );
  const completedLectures =
    Object.values(lectureProgress).filter(Boolean).length;
  const progressPercentage =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 진행 표시줄 */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center text-sm font-medium hover:underline"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {course.title}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {progressPercentage}% 완료
            </span>
            <Progress value={progressPercentage} className="w-24 h-2" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              {currentLecture.title}
            </h1>

            {/* 비디오 플레이어 */}
            {currentLecture.type === "video" && embedUrl && (
              <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden mb-8 bg-black">
                <iframe
                  src={embedUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentLecture.title}
                ></iframe>
              </div>
            )}

            {/* 강의 설명 */}
            <div className="space-y-6 mb-8">
              {/* <div>
                <h2 className="text-xl font-semibold mb-2">강의 설명</h2>
                <p className="text-muted-foreground">
                  {currentLecture.description ||
                    "이 강의에 대한 설명이 없습니다."}
                </p>
              </div> */}

              {currentLecture.notes && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">강의 노트</h2>
                    <Card>
                      <CardContent className="p-4">
                        <p>{currentLecture.notes}</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* 자료 */}
              {currentLecture.resources &&
                currentLecture.resources.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-xl font-semibold mb-2">강의 자료</h2>
                      <div className="space-y-2">
                        {currentLecture.resources.map((resource, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            {resource.type === "pdf" ? (
                              <FileText className="h-5 w-5 text-red-500 mr-3" />
                            ) : (
                              <FileText className="h-5 w-5 text-blue-500 mr-3" />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {resource.type.toUpperCase()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={resource.url}>다운로드</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </div>

            {/* 이전/다음 강의 네비게이션 */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              {prevLecture ? (
                <Button variant="outline" asChild>
                  <Link
                    href={`/courses/${courseId}/lectures/${prevLecture.id}`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    이전 강의
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}

              <Button
                variant={isCompleted ? "outline" : "default"}
                onClick={toggleLectureCompletion}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    완료됨
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    완료 표시
                  </>
                )}
              </Button>

              {nextLecture ? (
                <Button variant="outline" asChild>
                  <Link
                    href={`/courses/${courseId}/lectures/${nextLecture.id}`}
                  >
                    다음 강의
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        {/* 사이드바 - 강의 목차 */}
        <div
          className={cn(
            "bg-muted/40 border-l w-full md:w-80 overflow-y-auto transition-all duration-300 fixed md:relative inset-y-0 right-0 z-20",
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0 md:w-0"
          )}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">강의 목차</h2>
            <Accordion
              type="multiple"
              defaultValue={[`module-${moduleIndex}`]}
              className="space-y-2"
            >
              {course.modules.map((module, idx) => (
                <AccordionItem
                  key={module.id}
                  value={`module-${idx}`}
                  className="border rounded-md overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-2 hover:bg-muted">
                    <div className="flex items-center text-left">
                      <span className="font-medium">{module.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 p-1">
                      {module.lectures.map((lecture) => (
                        <Link
                          key={lecture.id}
                          href={`/courses/${courseId}/lectures/${lecture.id}`}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm",
                            lecture.id === lectureId
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {lectureProgress[lecture.id] ? (
                            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          ) : (
                            <PlayCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          )}
                          <span className="truncate">{lecture.title}</span>
                          <span className="ml-auto text-xs opacity-70 flex-shrink-0">
                            {lecture.duration || ""}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* 하단 정보 바 */}
      <div className="bg-background border-t py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {currentLecture.duration || "시간 정보 없음"}
                </span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {totalLectures}개 강의 중 {completedLectures}개 완료
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              {sidebarOpen ? "목차 닫기" : "목차 보기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
