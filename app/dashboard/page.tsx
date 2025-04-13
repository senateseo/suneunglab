import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  BarChart,
  Award,
  Bell,
} from "lucide-react";

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
];

// Mock data for upcoming deadlines
const upcomingDeadlines = [
  {
    course: "수능 국어 완성",
    assignment: "문학 작품 분석 과제",
    dueDate: "내일, 오후 11:59",
  },
  {
    course: "수능 수학 기초",
    assignment: "미분 연습 문제",
    dueDate: "3일 후",
  },
  {
    course: "수능 영어 독해 전략",
    assignment: "어휘 테스트",
    dueDate: "다음 월요일",
  },
];

// Mock data for recent announcements
const recentAnnouncements = [
  {
    course: "수능 국어 완성",
    message: "이번 주 금요일에 실시간 Q&A 세션이 있을 예정입니다.",
    date: "어제",
  },
  {
    course: "수능 수학 기초",
    message: "새로운 연습 문제가 추가되었습니다. 확인해보세요!",
    date: "2일 전",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your learning progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          <Button size="sm">
            <GraduationCap className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Courses Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">
                {enrolledCourses.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">
                {Math.round(
                  enrolledCourses.reduce(
                    (acc, course) => acc + course.progress,
                    0
                  ) / enrolledCourses.length
                )}
                %
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">1</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="mb-8">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
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
                    <h3 className="font-semibold text-lg mb-2">
                      {course.title}
                    </h3>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground mb-2 md:mb-0">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Last accessed {course.lastAccessed}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">
                          {course.progress}% complete
                        </span>
                      </div>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-4" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Next up:
                        </p>
                        <div className="flex items-center">
                          <PlayCircle className="h-4 w-4 text-primary mr-2" />
                          <span>{course.nextLesson}</span>
                        </div>
                      </div>
                      <Button className="mt-4 md:mt-0" asChild>
                        <Link href={`/courses/${course.id}`}>Continue</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link href="/courses">Browse More Courses</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          {upcomingDeadlines.map((deadline, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{deadline.assignment}</h3>
                    <p className="text-sm text-muted-foreground">
                      {deadline.course}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">
                      {deadline.dueDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
          {recentAnnouncements.map((announcement, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-sm font-medium">
                    {announcement.course}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {announcement.date}
                  </span>
                </div>
                <p>{announcement.message}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
            <CardDescription>Your activity over the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/50">
              <p className="text-muted-foreground">
                Learning activity chart would appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              Badges and milestones you've earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm">First Course</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm">Certificate</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-sm">Graduate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlayCircle({ className }: { className: string }) {
  return <Clock className={className} />;
}
