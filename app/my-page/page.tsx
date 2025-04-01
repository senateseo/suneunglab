import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, PlayCircle } from "lucide-react"

// Mock data for enrolled courses
const enrolledCourses = [
  {
    id: 1,
    title: "수능 국어 완성",
    progress: 65,
    nextLesson: "비문학 독해 전략",
    image: "/placeholder.svg?height=100&width=200",
    lastAccessed: "2일 전",
  },
  {
    id: 2,
    title: "수능 수학 기초",
    progress: 30,
    nextLesson: "함수의 미분법",
    image: "/placeholder.svg?height=100&width=200",
    lastAccessed: "1주일 전",
  },
  {
    id: 3,
    title: "수능 영어 독해 전략",
    progress: 10,
    nextLesson: "장문 독해 방법",
    image: "/placeholder.svg?height=100&width=200",
    lastAccessed: "3일 전",
  },
]

export default function MyLecturesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">내 강의</h1>
        <p className="text-muted-foreground">중단한 부분부터 계속 학습하세요</p>
      </div>

      <div className="space-y-6">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/4">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground mb-2 md:mb-0">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>마지막 접속: {course.lastAccessed}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">{course.progress}% 완료</span>
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-2 mb-4" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">다음 강의:</p>
                      <div className="flex items-center">
                        <PlayCircle className="h-4 w-4 text-primary mr-2" />
                        <span>{course.nextLesson}</span>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0" asChild>
                      <Link href={`/courses/${course.id}/lectures/l1`}>계속하기</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">아직 등록한 강의가 없습니다.</p>
            <Button asChild>
              <Link href="/courses">강의 둘러보기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

